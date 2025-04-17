const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let db = null;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('bloodbank');
    console.log(`DB connected to ${config.hostname}`);
    return db;
  } catch (err) {
    console.error(`DB connection failed: ${err.message}`);
    process.exit(1);
  }
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connectToDatabase() first.');
  return db;
}

module.exports = { connectToDatabase, getDb };
