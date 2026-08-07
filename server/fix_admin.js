import db from './db.js';

async function fix() {
  try {
    await db.query(`UPDATE wd_users SET password = $1 WHERE username = 'admin'`, ['$2b$10$RctC5doUGaoUHNTWR3LM4uhhoKg9pM0MYKKyaUP7wF8MFVDCsTPiy']);
    console.log('Fixed admin password!');
  } catch (err) {
    console.error(err);
  }
}
fix();
