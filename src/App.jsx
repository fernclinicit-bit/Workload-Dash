import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCard from './components/DashboardCard';
import { WorkloadAreaChart, WorkloadBarChart } from './components/WorkloadChart';
import RecentTasks from './components/RecentTasks';
import TaskForm from './components/TaskForm';
import { generateInitialTasks, computeDashboardData } from './data/mockData';

function App() {
  const [activeDept, setActiveDept] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'form'
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
    // If we edit a task, we could switch to form view or keep it as modal.
    // The current TaskForm uses a modal if `editingTask` is set, so we don't strictly need to switch views.
    // But switching view might be cleaner if they are on dashboard.
    // Let's just rely on the modal for edits, it's a good UX.
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // When changing department, default to dashboard view
  const handleDeptChange = (deptId) => {
    setActiveDept(deptId);
    setActiveView('dashboard');
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeDept={activeDept} 
        setActiveDept={handleDeptChange} 
        activeView={activeView}
        setActiveView={setActiveView}
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
              <RecentTasks tasks={data.recentTasks} onEditTask={handleEditTask} />
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
              <RecentTasks tasks={data.recentTasks} onEditTask={handleEditTask} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
