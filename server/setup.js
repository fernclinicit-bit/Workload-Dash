import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') }); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    const sql = fs.readFileSync(__dirname + '/init.sql', 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully with wd_ tables!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    pool.end();
  }
}

setupDatabase();
