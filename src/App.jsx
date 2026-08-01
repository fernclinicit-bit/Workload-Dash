import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCard from './components/DashboardCard';
import { WorkloadAreaChart, WorkloadBarChart } from './components/WorkloadChart';
import RecentTasks from './components/RecentTasks';
import TaskForm from './components/TaskForm';
import { generateMockData, departments } from './data/mockData';

function App() {
  const [activeDept, setActiveDept] = useState('overview');
  const [addedTasks, setAddedTasks] = useState([]);
  const [editedTasks, setEditedTasks] = useState({});
  const [editingTask, setEditingTask] = useState(null);

  // Generate base data when department changes
  const baseData = useMemo(() => generateMockData(activeDept), [activeDept]);

  // Combine base data with user-added and user-edited tasks
  const data = useMemo(() => {
    const combined = { ...baseData };
    
    // Filter added tasks by department if not in overview
    const deptName = departments.find(d => d.id === activeDept)?.name;
    const relevantAddedTasks = addedTasks.filter(t => 
      activeDept === 'overview' || t.dept === deptName
    );

    let allTasks = [...combined.recentTasks];

    if (relevantAddedTasks.length > 0) {
      allTasks = [...relevantAddedTasks, ...allTasks];
      
      // Update metrics slightly to reflect added tasks
      if (combined.metrics && combined.metrics[0]) {
        const currentActiveStr = combined.metrics[0].value.replace(/,/g, '');
        const currentActive = parseInt(currentActiveStr, 10);
        if (!isNaN(currentActive)) {
          combined.metrics = [...combined.metrics]; // CLONE ARRAY FIRST
          combined.metrics[0] = {
            ...combined.metrics[0],
            value: (currentActive + relevantAddedTasks.length).toLocaleString()
          };
        }
      }
    }

    // Apply edits
    allTasks = allTasks.map(task => 
      editedTasks[task.id] ? { ...task, ...editedTasks[task.id] } : task
    );
    
    // If we are not in overview, make sure we only show tasks for this department after edits
    if (activeDept !== 'overview') {
      allTasks = allTasks.filter(t => t.dept === deptName);
    }

    combined.recentTasks = allTasks.slice(0, 15);

    return combined;
  }, [baseData, addedTasks, editedTasks, activeDept]);

  const handleAddTask = (newTask) => {
    setAddedTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask) => {
    setEditedTasks(prev => ({
      ...prev,
      [updatedTask.id]: updatedTask
    }));
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
