import React from 'react';
import { Pencil } from 'lucide-react';

export default function RecentTasks({ tasks, onEditTask }) {
  const getPriorityBadgeClass = (priority) => {
    if (!priority) return 'badge';
    switch (priority.toLowerCase()) {
      case 'high': return 'badge high';
      case 'medium': return 'badge medium';
      case 'low': return 'badge low';
      default: return 'badge';
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge';
    switch (status.toLowerCase()) {
      case 'completed': return 'badge low'; // Green
      case 'in progress': return 'badge medium'; // Yellow/Orange
      case 'to do': return 'badge'; // Default styling
      default: return 'badge';
    }
  };

  return (
    <div className="table-card">
      <div className="chart-header">
        <h3>Recent Tasks / Projects</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Title</th>
            <th>Department</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>{task.title}</td>
              <td>{task.dept}</td>
              <td>{task.assignee}</td>
              <td>
                <span className={getPriorityBadgeClass(task.priority)}>
                  {task.priority || 'Medium'}
                </span>
              </td>
              <td>
                <span className={getStatusBadgeClass(task.status)}>
                  {task.status || 'To Do'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button 
                  type="button"
                  className="btn" 
                  style={{ padding: '6px', color: 'var(--text-muted)' }} 
                  onClick={() => onEditTask && onEditTask(task)}
                  title="Edit Task"
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
