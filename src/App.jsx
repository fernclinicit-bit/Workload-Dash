import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCard from './components/DashboardCard';
import { WorkloadAreaChart, WorkloadBarChart } from './components/WorkloadChart';
import RecentTasks from './components/RecentTasks';
import TaskForm from './components/TaskForm';
import { generateInitialTasks, computeDashboardData } from './data/mockData';

function App() {
  const [activeDept, setActiveDept] = useState('overview');
  const [editingTask, setEditingTask] = useState(null);
  
  // Single source of truth for all tasks
  const [tasks, setTasks] = useState(() => generateInitialTasks());

  // Compute dashboard data dynamically based on tasks and active department
  const data = useMemo(() => computeDashboardData(tasks, activeDept), [tasks, activeDept]);

  const handleAddTask = (newTask) => {
    // Assign a random day of week to the new task for the Area Chart visualization
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const taskWithDay = {
      ...newTask,
      dayOfWeek: days[Math.floor(Math.random() * days.length)]
    };
    
    setTasks(prev => [taskWithDay, ...prev]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <Sidebar activeDept={activeDept} setActiveDept={setActiveDept} />
      
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{data.title}</h1>
            <p>Track, manage, and analyze team workloads efficiently.</p>
          </div>
        </header>

        <TaskForm 
          activeDept={activeDept} 
          onAddTask={handleAddTask}
          editingTask={editingTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={handleCancelEdit}
        />

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
          <RecentTasks tasks={data.recentTasks} onEditTask={handleEditTask} />
        </section>
      </main>
    </div>
  );
}

export default App;
