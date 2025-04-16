const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const path = require('path');
const app = express();
const PORT = 8080;

let mages = [];
let stats = [];

let globalStats = {
  totalBloodLost: 0,
};

const authCookieName = 'mage_auth';

const port = process.argv.length > 2 ? process.argv[2] : 8080;

app.use(cookieParser());
app.use(express.json());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//I do hereby solemnly swear that I am very carefully reading through the Simon code to make sure I understand what is happening at this level
const createMage = async (mageName, passphrase) => {
  const mage = {
    mageName,
    passphrase: await bcrypt.hash(passphrase, 10),
    token: uuid.v4(),
  };
  mages.push(mage);
  stats[mageName] = {
    bloodLost: 0,
    deaths: 0,
    woundsTaken: 0,
    woundsHealed: 0,
  };
  return mage;
};

apiRouter.post('/auth/register', async (req, res) => {
  if (await findMage('mageName', req.body.mageName)) {
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
  const mage = await findMage('mageName', req.body.mageName);

  if (mage && await bcrypt.compare(req.body.passphrase, mage.passphrase)) {
    mage.token = uuid.v4();
    setAuthCookie(res, mage.token);

    return res.status(200).send({
      success: true,
      msg: `OPEN UNTO YOU, ${mage.mageName.toUpperCase()}!`,
      mageName: mage.mageName,
    });
  }

  res.status(401).send({ success: false, msg: 'WOE! PLAGUE BE UPON YE! A THOUSAND CURSES!' });
});

//How does this know if it's the *right* user though?
//I guess it just needs to know if there is a user that's logged in correctly
const verifyAuth = async (req, res, next) => {
  const mage = await findMage('token', req.cookies[authCookieName]);
  if (mage) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.delete('/auth/logout', async (req, res) => {
  const mage = await findMage('token', req.cookies[authCookieName]);
  if (mage) {
    delete mage.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/stats', (req, res) => {
  if (!req.cookies[authCookieName]) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.get('/stats/me', verifyAuth, async (req, res) => {
  const mage = await findMage('token', req.cookies[authCookieName]);
  if (mage && stats[mage.mageName]) {
    res.send(stats[mage.mageName]);
  } else {
    res.status(404).send({ msg: 'Stats not found' });
  }
});

apiRouter.post('/stats/me', verifyAuth, async (req, res) => {
  const mage = await findMage('token', req.cookies[authCookieName]);
  if (!mage || !stats[mage.mageName]) {
    return res.status(404).send({ msg: 'Mage or stats not found' });
  }

  const mageStats = stats[mage.mageName];

  for (let key of ['bloodLost', 'deaths', 'woundsTaken', 'woundsHealed']) {
    if (req.body[key]) {
      mageStats[key] += req.body[key];
      if (key === 'bloodLost') {
        globalStats.totalBloodLost += req.body[key];
      }
    }
  }
  res.send(mageStats);
});

apiRouter.get('/stats/global', (_req, res) => {
  res.send(globalStats);
});

async function findMage(field, value) {
  if (!value) return null;

  return mages.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
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

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*path', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});