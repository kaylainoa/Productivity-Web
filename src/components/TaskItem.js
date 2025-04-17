// src/components/TaskItem.js
import React from 'react';
import { Trash2 } from 'lucide-react';
import UrgencyIndicator from './UrgencyIndicator';
import '../styles/Tasks.css';

function TaskItem({ task, onToggleComplete, onDelete }) {
  return (
    <div className="task-item">
      <div className="task-item-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
        />
        <div className="task-details">
          <div className="task-title-container">
            <span className={`task-title ${task.completed ? 'task-completed' : ''}`}>
              {task.title}
            </span>
            <UrgencyIndicator urgency={task.urgency} />
          </div>
          <span className="task-due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="task-delete-button"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default TaskItem;