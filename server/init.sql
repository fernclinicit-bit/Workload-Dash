CREATE TABLE IF NOT EXISTS wd_departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS wd_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  department_id VARCHAR(50) REFERENCES wd_departments(id),
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS wd_tasks (
  id SERIAL PRIMARY KEY,
  task_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  department_id VARCHAR(50) REFERENCES wd_departments(id),
  assignee VARCHAR(100) NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(20) DEFAULT 'To Do',
  day_of_week VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial departments
INSERT INTO wd_departments (id, name, icon) VALUES 
('overview', 'Overview', 'LayoutDashboard'),
('it', 'IT Department', 'Monitor'),
('hr', 'Human Resources', 'Users'),
('sales', 'Sales', 'TrendingUp'),
('marketing', 'Marketing', 'Megaphone'),
('operations', 'Operations', 'Settings')
ON CONFLICT (id) DO NOTHING;

-- Insert a default admin user (Password is 'admin123' hashed with bcrypt)
-- Note: Replace this with your own secure password in production!
INSERT INTO wd_users (username, password, department_id, role) VALUES 
('admin', '$2b$10$w/XlF8.n/9YlF.hXq6kO.O60fM9rM2B8X/C6V0y/R3V3/8525s0T6', 'overview', 'admin')
ON CONFLICT (username) DO NOTHING;
