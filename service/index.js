const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const path = require('path');
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const dbName = 'clinic';

const app = express();
const PORT = 4000;

const authCookieName = 'mage_auth';

let magesCollection;
let statsCollection;
let globalCollection;

app.use(cookieParser());
app.use(express.json());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.use(express.static('public'));

//I do hereby solemnly swear that I am very carefully reading through the Simon code to make sure I understand what is happening at this level
const createMage = async (mageName, passphrase) => {
  const hashedPass = await bcrypt.hash(passphrase, 10);
  const token = uuid.v4();

  await magesCollection.insertOne({ mageName, passphrase: hashedPass, token });
  await statsCollection.insertOne({
    mageName,
    bloodLost: 0,
    deaths: 0,
    woundsTaken: 0,
    woundsHealed: 0,
  });

  return { mageName, token };
};

apiRouter.post('/auth/register', async (req, res) => {
  const existing = await magesCollection.findOne({ mageName: req.body.mageName });
  if (existing) {
    return res.status(409).send({ msg: 'YE WOULD TO TAKE THE NAME OF ANOTHER WARLOCK>!>! CUR UPON THEE!!!4' });
  }

  const user = await createMage(req.body.mageName, req.body.passphrase);
  setAuthCookie(res, user.token);

  res.status(201).send({
    success: true,
    msg: `WELCOME, ${user.mageName}!`,
    mageName: user.mageName,
  });
});

apiRouter.post('/auth/login', async (req, res) => {
  const mage = await magesCollection.findOne({ mageName: req.body.mageName });

  if (mage && await bcrypt.compare(req.body.passphrase, mage.passphrase)) {
    const token = uuid.v4();
    await magesCollection.updateOne({ mageName: req.body.mageName }, { $set: { token } });
    setAuthCookie(res, token);

    return res.status(200).send({
      success: true,
      msg: `OPEN UNTO YOU, ${mage.mageName.toUpperCase()}!`,
      mageName: mage.mageName,
    });
  }

  res.status(401).send({ success: false, msg: 'WOE! PLAGUE BE UPON YE! A THOUSAND CURSES!' });
});

const verifyAuth = async (req, res, next) => {
  const token = req.cookies[authCookieName];
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  const mage = await magesCollection.findOne({ token });
  if (mage) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/auth/verify', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (!token) {
    return res.status(401).send({ loggedIn: false });
  }
  const mage = await magesCollection.findOne({ token });
  if (mage) {
    res.status(200).send({ loggedIn: true, mageName: mage.mageName });
  } else {
    res.status(401).send({ loggedIn: false });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  await magesCollection.updateOne({ token: req.cookies[authCookieName] }, { $unset: { token: "" } });
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/stats', verifyAuth, async (req, res) => {
  const stats = await statsCollection.find().toArray();
  res.send(stats);
});

apiRouter.get('/stats/me', verifyAuth, async (req, res) => {
  const mage = await magesCollection.findOne({ token: req.cookies[authCookieName] });
  const mageStats = await statsCollection.findOne({ mageName: mage.mageName });

  if (mageStats) {
    res.send(mageStats);
  } else {
    res.status(404).send({ msg: 'Stats not found' });
  }
});

apiRouter.post('/stats/me', verifyAuth, async (req, res) => {
  const mage = await magesCollection.findOne({ token: req.cookies[authCookieName] });
  
  console.log('Received mage:', mage);

  if (!mage) {
    return res.status(401).send({ msg: 'No mage found for this token' });
  }

  const updateFields = {};
  let bloodLostDelta = 0;

  console.log('Request body:', req.body);

  if ('bloodLost' in req.body) {
    updateFields.bloodLost = parseFloat(req.body.bloodLost) || 0;
    bloodLostDelta = updateFields.bloodLost;
  }

  if ('deaths' in req.body) {
    updateFields.deaths = parseInt(req.body.deaths) || 0;
  }
  
  if ('woundsTaken' in req.body) {
    updateFields.woundsTaken = parseInt(req.body.woundsTaken) || 0;
  }
  
  if ('woundsHealed' in req.body) {
    updateFields.woundsHealed = parseInt(req.body.woundsHealed) || 0;
  }

  console.log('Update fields:', updateFields);

  try {
    if (Object.keys(updateFields).length > 0) {
      await statsCollection.updateOne({ mageName: mage.mageName }, { $inc: updateFields });
      
      if (bloodLostDelta > 0) {
        await globalCollection.updateOne({}, { $inc: { totalBloodLost: bloodLostDelta } });
      }
    }

    const updatedStats = await statsCollection.findOne({ mageName: mage.mageName });
    console.log('Updated stats:', updatedStats);
    res.send(updatedStats);
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).send({ msg: 'Error updating stats' });
  }
});

apiRouter.get('/stats/global', async (_req, res) => {
  const globalStats = await globalCollection.findOne({});
  res.send(globalStats);
});

//Set AuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.get('/error', (req, res, next) => {
  throw new Error('206: Out of Bones');
});

app.use(function (err, req, res, next) {
  res.status(206).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function main() {
  try {
    await client.connect();
    const db = client.db(dbName);
    magesCollection = db.collection('mages');
    statsCollection = db.collection('stats');
    globalCollection = db.collection('global');

    const existingGlobal = await globalCollection.findOne({});
    if (!existingGlobal) {
      await globalCollection.insertOne({ totalBloodLost: 0 });
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database', err);
    process.exit(1);
  }
}

main();
