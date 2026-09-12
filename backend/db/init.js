const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const schemaPath = path.join(__dirname, 'schema.sql');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carnodes';

async function initDatabase() {
  console.log(`[DB Init] Initializing database using connection string: ${connectionString}`);

  // Parse connection string to extract database name
  const urlParts = new URL(connectionString);
  const dbName = urlParts.pathname.substring(1) || 'carnodes';

  // Step 1: Connect to default postgres DB to ensure target DB exists
  urlParts.pathname = '/postgres';
  const rootClient = new Client({ connectionString: urlParts.toString() });

  try {
    await rootClient.connect();
    const res = await rootClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rows.length === 0) {
      console.log(`[DB Init] Creating database '${dbName}'...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[DB Init] Database '${dbName}' created successfully.`);
    } else {
      console.log(`[DB Init] Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.warn(`[DB Init] Could not connect to default 'postgres' database: ${err.message}. Proceeding directly...`);
  } finally {
    await rootClient.end().catch(() => {});
  }

  // Step 2: Connect to target DB and apply schema.sql
  const dbClient = new Client({ connectionString });
  try {
    await dbClient.connect();
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log(`[DB Init] Applying schema from ${schemaPath}...`);
    await dbClient.query(schemaSql);
    console.log('[DB Init] Schema initialized successfully!');
  } catch (err) {
    console.error('[DB Init] Error applying schema:', err);
    throw err;
  } finally {
    await dbClient.end().catch(() => {});
  }
}

if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initDatabase;
