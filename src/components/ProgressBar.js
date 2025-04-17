// src/components/ProgressBar.js
import React from 'react';
import '../styles/Dashboard.css';

function ProgressBar({ percentage }) {
  return (
    <div className="progress-container">
      <p className="progress-text">Tasks Completion: {percentage}%</p>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;