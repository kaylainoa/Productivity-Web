// src/components/AddTaskFAB.js
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTasks } from '../contexts/TaskProvider';
import '../styles/AddTaskFAB.css';

function AddTaskFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [urgency, setUrgency] = useState(0);
  const { addTask } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        dueDate,
        urgency: parseInt(urgency)
      });
      setTitle('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setUrgency(0);
      setIsOpen(false);
    }
  };

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-form-container">
          <div className="fab-form-card">
            <div className="fab-form-header">
              <h3>Add New Task</h3>
              <button 
                className="fab-close-button"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="fab-form">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="fab-task-input"
                autoFocus
              />
              <div className="fab-form-row">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="fab-date-input"
                />
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="fab-urgency-select"
                >
                  <option value="0">Normal</option>
                  <option value="1">Important</option>
                  <option value="2">Urgent</option>
                </select>
              </div>
              <button type="submit" className="fab-submit-button">
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
      <button 
        className="fab-button" 
        onClick={() => setIsOpen(true)}
        aria-label="Add new task"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

export default AddTaskFAB;