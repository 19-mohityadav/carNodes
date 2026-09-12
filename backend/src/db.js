const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

let pool;

if (process.env.USE_MEMORY_DB === 'true') {
  console.log('[Database] Initializing in-memory PostgreSQL engine (pg-mem)...');
  const { newDb } = require('pg-mem');
  const memDb = newDb();
  
  // Register pgcrypto gen_random_uuid
  memDb.public.registerFunction({
    name: 'gen_random_uuid',
    impure: true,
    implementation: () => crypto.randomUUID()
  });

  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8').replace(/CREATE EXTENSION[^\n]*;/gi, '');
  memDb.public.none(schemaSql);

  const { Pool: MemPool } = memDb.adapters.createPg();
  pool = new MemPool();
} else {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carnodes';
  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

pool.on('error', (err) => {
  console.error('[Database] Unexpected database pool error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
