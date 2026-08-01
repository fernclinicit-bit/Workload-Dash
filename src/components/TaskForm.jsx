import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { departments } from '../data/mockData';

export default function TaskForm({ activeDept, onAddTask, editingTask, onUpdateTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [dept, setDept] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setAssignee(editingTask.assignee);
      setPriority(editingTask.priority || 'Medium');
      setTaskStatus(editingTask.status || 'To Do');
      setDept(editingTask.dept);
    } else {
      setTitle('');
      setAssignee('');
      setPriority('Medium');
      setTaskStatus('To Do');
      setDept(activeDept === 'overview' ? 'IT Department' : (departments.find(d => d.id === activeDept)?.name || 'IT Department'));
    }
  }, [editingTask, activeDept]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !assignee) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title,
        assignee,
        priority,
        status: taskStatus,
        dept
      });
    } else {
      const newTask = {
        id: `TSK-${Math.floor(Math.random() * 10000)}`,
        title,
        dept,
        assignee,
        priority,
        status: taskStatus
      };
      onAddTask(newTask);
    }

    setTitle('');
    setAssignee('');
  };

  const formContent = (
    <div className={editingTask ? "modal-content" : "card"} style={{ marginBottom: editingTask ? 0 : '32px' }}>
      <div className="card-header" style={{ padding: editingTask ? '24px 24px 0 24px' : undefined }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.125rem' }}>
          {editingTask ? 'Edit Workload' : 'Add New Workload'}
        </h3>
        {editingTask && (
          <button type="button" className="btn" onClick={onCancelEdit} style={{ padding: '4px', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ 
        display: 'grid', 
        gridTemplateColumns: editingTask ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        alignItems: 'end',
        padding: editingTask ? '24px' : undefined
      }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Task Title</label>
          <input 
            type="text" 
            className="form-input" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Q4 Financial Report"
            required 
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Assignee</label>
          <input 
            type="text" 
            className="form-input" 
            value={assignee} 
            onChange={e => setAssignee(e.target.value)} 
            placeholder="Name of employee"
            required 
          />
        </div>

        {(activeDept === 'overview' || editingTask) && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department</label>
            <select className="form-select" value={dept} onChange={e => setDept(e.target.value)}>
              {departments.filter(d => d.id !== 'overview').map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Priority</label>
          <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Status</label>
          <select className="form-select" value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '46px', justifyContent: 'center' }}>
          {editingTask ? (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Add Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  if (editingTask) {
    return (
      <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) onCancelEdit(); }}>
        {formContent}
      </div>
    );
  }

  return formContent;
}
