import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Assuming ran from server dir, but let's be safe: it reads env when app starts
// actually, let's just use dotenv.config() and rely on running from root or passing env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default {
  query: (text, params) => pool.query(text, params),
};
