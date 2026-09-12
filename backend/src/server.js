const app = require('./app');
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server listener
db.query('SELECT NOW()')
  .then((res) => {
    console.log(`[Database] PostgreSQL connected successfully at ${res.rows[0].now}`);
    app.listen(PORT, () => {
      console.log(`[Server] CarNodes API running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('[Database] Failed to connect to PostgreSQL:', err.message);
    console.warn('[Server] Starting server without DB connection (verify DATABASE_URL)...');
    app.listen(PORT, () => {
      console.log(`[Server] CarNodes API running on port ${PORT}`);
    });
  });
