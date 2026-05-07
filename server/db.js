const { Pool } = require('pg');
require('dotenv').config();

// Ensure the connection string exists before trying to connect
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is missing in .env file!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Railway requires SSL for public connections
    rejectUnauthorized: false,
  },
});

// Test the connection immediately on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database Connection Error details:');
    console.error('- Message:', err.message);
    console.error('- Code:', err.code);
    return;
  }
  console.log('✅ Connected to Railway PostgreSQL successfully!');
  release();
});

module.exports = pool;