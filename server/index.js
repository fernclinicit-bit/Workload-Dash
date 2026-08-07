import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../dist')));

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-please-change';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
};

// GET /api/departments (Public, used for login dropdown if needed)
app.get('/api/departments', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM wd_departments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query('SELECT * FROM wd_users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, department_id: user.department_id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, department_id: user.department_id, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary endpoint to fix admin password
app.get('/api/fix-admin', async (req, res) => {
  try {
    await db.query(`UPDATE wd_users SET password = $1 WHERE username = 'admin'`, ['$2b$10$RctC5doUGaoUHNTWR3LM4uhhoKg9pM0MYKKyaUP7wF8MFVDCsTPiy']);
    res.send('Admin password fixed! You can now login with admin123');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fixing password: ' + err.message);
  }
});

// GET /api/tasks
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT t.*, d.name as dept_name FROM wd_tasks t JOIN wd_departments d ON t.department_id = d.id';
    let params = [];
    
    // If not overview admin, restrict to their department
    if (req.user.department_id !== 'overview') {
      query += ' WHERE t.department_id = $1';
      params.push(req.user.department_id);
    }
    
    query += ' ORDER BY t.created_at DESC';
    const result = await db.query(query, params);
    
    // Map backend keys to frontend keys
    const tasks = result.rows.map(r => ({
      id: r.task_id,
      title: r.title,
      dept: r.dept_name,
      department_id: r.department_id,
      assignee: r.assignee,
      priority: r.priority,
      status: r.status,
      dayOfWeek: r.day_of_week
    }));
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { id, title, department_id, assignee, priority, status, dayOfWeek } = req.body;
  
  // Security check: normal users can only add to their own dept
  if (req.user.department_id !== 'overview' && department_id !== req.user.department_id) {
    return res.status(403).json({ error: 'Unauthorized department' });
  }

  try {
    const result = await db.query(
      `INSERT INTO wd_tasks (task_id, title, department_id, assignee, priority, status, day_of_week) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, title, department_id, assignee, priority, status, dayOfWeek]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { title, assignee, priority, status } = req.body;
  const taskId = req.params.id;
  
  try {
    const taskResult = await db.query('SELECT department_id FROM wd_tasks WHERE task_id = $1', [taskId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    
    const taskDept = taskResult.rows[0].department_id;
    if (req.user.department_id !== 'overview' && taskDept !== req.user.department_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateResult = await db.query(
      `UPDATE wd_tasks SET title = $1, assignee = $2, priority = $3, status = $4 WHERE task_id = $5 RETURNING *`,
      [title, assignee, priority, status, taskId]
    );
    res.json(updateResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const taskId = req.params.id;
  try {
    const taskResult = await db.query('SELECT department_id FROM wd_tasks WHERE task_id = $1', [taskId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    
    if (req.user.department_id !== 'overview' && taskResult.rows[0].department_id !== req.user.department_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.query('DELETE FROM wd_tasks WHERE task_id = $1', [taskId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
