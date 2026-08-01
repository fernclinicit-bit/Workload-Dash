import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCard from './components/DashboardCard';
import { WorkloadAreaChart, WorkloadBarChart } from './components/WorkloadChart';
import RecentTasks from './components/RecentTasks';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import { computeDashboardData } from './data/mockData';

function App() {
  const [user, setUser] = useState(null);
  const [activeDept, setActiveDept] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'form'
  const [editingTask, setEditingTask] = useState(null);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on load
    const token = localStorage.getItem('token');
    if (token) {
      // Very basic restore (in a real app, verify token with backend)
      setUser({ role: 'admin' }); // Mock restore
      loadTasks();
    } else {
      setLoading(false);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      if (err.message.includes('401') || err.message.includes('403')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.department_id !== 'overview') {
      setActiveDept(userData.department_id);
    }
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTasks([]);
  };

  // Compute dashboard data dynamically based on tasks and active department
  const data = useMemo(() => computeDashboardData(tasks, activeDept), [tasks, activeDept]);

  const handleAddTask = async (newTask) => {
    try {
      // Backend expects: { id, title, department_id, assignee, priority, status, dayOfWeek }
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const payload = {
        id: newTask.id,
        title: newTask.title,
        department_id: newTask.dept, // Assuming TaskForm returns dept id
        assignee: newTask.assignee,
        priority: newTask.priority,
        status: newTask.status,
        dayOfWeek: days[Math.floor(Math.random() * days.length)]
      };
      await createTask(payload);
      loadTasks(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask.id, {
        title: updatedTask.title,
        assignee: updatedTask.assignee,
        priority: updatedTask.priority,
        status: updatedTask.status
      });
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        loadTasks();
      } catch (err) {
        console.error(err);
        alert('Failed to delete task');
      }
    }
  };

  const handleDeptChange = (deptId) => {
    setActiveDept(deptId);
    setActiveView('dashboard');
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>;

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeDept={activeDept} 
        setActiveDept={handleDeptChange} 
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{data.title} {activeView === 'form' ? '- Data Entry' : ''}</h1>
            <p>
              {activeView === 'form' 
                ? 'Enter new workloads and tasks for the department.' 
                : 'Track, manage, and analyze team workloads efficiently.'}
            </p>
          </div>
        </header>

        {activeView === 'form' ? (
          <div className="data-entry-view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <TaskForm 
              activeDept={activeDept} 
              onAddTask={handleAddTask}
              editingTask={editingTask}
              onUpdateTask={handleUpdateTask}
              onCancelEdit={handleCancelEdit}
            />
            <section>
              <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: 'var(--text-main)' }}>Recently Added</h2>
              <RecentTasks tasks={data.recentTasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
            </section>
          </div>
        ) : (
          <div className="dashboard-view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Render TaskForm Modal if editing (TaskForm handles its own modal rendering when editingTask is present) */}
            {editingTask && (
              <TaskForm 
                activeDept={activeDept} 
                onAddTask={handleAddTask}
                editingTask={editingTask}
                onUpdateTask={handleUpdateTask}
                onCancelEdit={handleCancelEdit}
              />
            )}

            <section className="dashboard-grid">
              {data.metrics.map((metric, idx) => (
                <DashboardCard key={idx} {...metric} />
              ))}
            </section>

            <section className="charts-grid">
              <WorkloadAreaChart data={data.workloadOverTime} />
              {activeDept === 'overview' && data.distribution ? (
                <WorkloadBarChart data={data.distribution} />
              ) : (
                <div className="chart-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown available in Overview</p>
                </div>
              )}
            </section>

            <section>
              <RecentTasks tasks={data.recentTasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
