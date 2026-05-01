import React, { useState, useEffect } from 'react';

const TaskForm = ({ currentTask, onSave, clearCurrent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentTask) {
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      let formattedDate = '';
      if (currentTask.dueDate) {
        const d = new Date(currentTask.dueDate);
        const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        formattedDate = new Date(d - tzoffset).toISOString().slice(0, 16);
      }
      setFormData({
        title: currentTask.title,
        description: currentTask.description || '',
        dueDate: formattedDate,
      });
      setErrors({});
    } else {
      setFormData({ title: '', description: '', dueDate: '' });
    }
  }, [currentTask]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due Date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day comparison
      
      // Since html date input uses local timezone implicitly, we compare local dates
      const selectedLocal = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);
      
      if (selectedLocal < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{currentTask ? 'Edit Task' : 'Add New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            name="title"
            className={`form-control ${errors.title ? 'error' : ''}`}
            placeholder="e.g. Complete assignment"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            className={`form-control ${errors.description ? 'error' : ''}`}
            placeholder="Brief details about the task..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Due Date & Time</label>
          <input
            type="datetime-local"
            name="dueDate"
            className={`form-control ${errors.dueDate ? 'error' : ''}`}
            value={formData.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {currentTask ? 'Update Task' : 'Save Task'}
        </button>
        {currentTask && (
          <button 
            type="button" 
            className="btn btn-sm btn-secondary" 
            style={{ marginTop: '10px', width: '100%' }}
            onClick={clearCurrent}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
