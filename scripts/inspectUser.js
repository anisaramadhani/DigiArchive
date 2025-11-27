const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const val = trimmed.slice(idx + 1);
    env[key] = val;
  }
  return env;
}

async function run() {
  const env = loadEnvFile();
  const uri = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = env.MONGODB_DB || process.env.MONGODB_DB || 'digiarchive';
    const db = client.db(dbName);
    const users = db.collection('users');

    const npmToFind = process.argv[2] || 'LT2025';
    const user = await users.findOne({ npm: npmToFind });
    console.log('Querying for npm=', npmToFind);
    console.log(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();