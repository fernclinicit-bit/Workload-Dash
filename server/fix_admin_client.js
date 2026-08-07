import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const client = new Client({
  connectionString: process.env.DATABASE_URL + '?sslmode=require',
});

async function fix() {
  try {
    await client.connect();
    await client.query(`UPDATE wd_users SET password = $1 WHERE username = 'admin'`, ['$2b$10$RctC5doUGaoUHNTWR3LM4uhhoKg9pM0MYKKyaUP7wF8MFVDCsTPiy']);
    console.log('Fixed admin password!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
fix();
