import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <h2 className="card-title">All Tasks</h2>
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
          <p>No tasks found. Create a new task to get started.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task Details</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className={task.status === 'completed' ? 'task-completed' : ''}>
                  <td>
                    <span className={`badge badge-${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td>
                    {new Date(task.dueDate).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td style={{ minWidth: '220px' }}>
                    <button 
                      className={`btn btn-sm ${task.status === 'completed' ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => onToggleStatus(task)}
                    >
                      {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary" 
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => onDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
