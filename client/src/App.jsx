import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Alert from './components/Alert';

//const API_URL = 'http://localhost:5000/api/tasks';

const API_URL = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
      showAlert('error', 'Failed to fetch tasks. Is the backend running?');
    }
  };

  const handleSave = async (taskData) => {
    try {
      if (currentTask) {
        // Update
        const res = await axios.put(`${API_URL}/${currentTask._id}`, taskData);
        if (res.data.success) {
          showAlert('success', 'Task updated successfully!');
          setCurrentTask(null);
          fetchTasks();
        }
      } else {
        // Create
        const res = await axios.post(API_URL, taskData);
        if (res.data.success) {
          showAlert('success', 'Task created successfully!');
          fetchTasks();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to save task';
      showAlert('error', errorMsg);
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await axios.delete(`${API_URL}/${id}`);
        if (res.data.success) {
          showAlert('success', 'Task deleted successfully!');
          fetchTasks();
        }
      } catch (error) {
        showAlert('error', 'Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await axios.put(`${API_URL}/${task._id}`, { status: updatedStatus });
      if (res.data.success) {
        showAlert('success', `Task marked as ${updatedStatus}!`);
        fetchTasks();
      }
    } catch (error) {
      showAlert('error', 'Failed to update task status');
    }
  };

  const clearCurrent = () => {
    setCurrentTask(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Management System</h1>
        <p>Stay organized and keep track of your tasks</p>
      </header>
      
      {alert.show && <Alert type={alert.type} message={alert.message} />}

      <main className="main-content">
        <div>
          <TaskForm 
            currentTask={currentTask} 
            onSave={handleSave} 
            clearCurrent={clearCurrent}
          />
        </div>
        <div>
          <TaskList 
            tasks={tasks} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
