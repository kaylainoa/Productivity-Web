// src/pages/TasksPage.js
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import useTasks from '../hooks/useTasks';
import '../styles/Tasks.css';

function TasksPage() {
  const { 
    tasks, 
    addTask, 
    toggleTaskCompletion, 
    deleteTask 
  } = useTasks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    dueDate: new Date().toISOString().split('T')[0],
    urgency: 0
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    if (addTask(newTask)) {
      setNewTask({ 
        title: '', 
        dueDate: new Date().toISOString().split('T')[0],
        urgency: 0
      });
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="tasks-container">
      <h1 className="tasks-heading">Tasks</h1>
      
      <div className="tasks-content-card">
        <div className="tasks-search">
          <div className="search-input-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            onKeyPress={handleKeyPress}
            className="task-input"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            className="task-date-input"
          />
          <select
            value={newTask.urgency}
            onChange={(e) => setNewTask({...newTask, urgency: parseInt(e.target.value)})}
            className="task-urgency-select"
          >
            <option value="0">No urgency</option>
            <option value="1">Important (!)</option>
            <option value="2">Urgent (!!)</option>
          </select>
          <button
            onClick={handleAddTask}
            className="task-add-button"
          >
            <Plus size={18} className="task-add-icon" />
            Add
          </button>
        </div>
        
        <div className="tasks-list">
          {activeTasks.length > 0 ? (
            activeTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <p className="tasks-empty-message">No active tasks found</p>
          )}
        </div>
        
        {completedTasks.length > 0 && (
          <div className="completed-tasks-section">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="completed-tasks-toggle"
            >
              <span className="completed-tasks-arrow">
                {showCompleted ? '▼' : '►'}
              </span>
              Completed Tasks ({completedTasks.length})
            </button>
            
            {showCompleted && (
              <div className="completed-tasks-list">
                {completedTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;