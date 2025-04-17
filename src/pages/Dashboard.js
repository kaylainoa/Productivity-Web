// src/pages/Dashboard.js
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { UserContext } from '../App';
import { useTasks } from '../contexts/TaskProvider'; 
import ProgressBar from '../components/ProgressBar';
import TaskItem from '../components/TaskItem';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useContext(UserContext);
  const { 
    tasks,
    getTodaysTasks, 
    getUpcomingTasks,
    getOverdueTasks,
    getTodaysCompletionPercentage,
    toggleTaskCompletion,
    deleteTask  // Import deleteTask function
  } = useTasks();
  
  // Get tasks directly from the TaskProvider
  const todaysTasks = useMemo(() => getTodaysTasks(), [tasks]); // React to changes in tasks
  const upcomingTasks = useMemo(() => getUpcomingTasks(), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(), [tasks]);
  const completionPercentage = useMemo(() => getTodaysCompletionPercentage(), [tasks]);
  
  // Track statistics
  const [stats, setStats] = useState({
    highPriorityCount: 0,
    completedToday: 0,
    totalTasks: 0
  });
  
  // Get today's date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Group overdue tasks by date - using useMemo to only recalculate when overdueTasks change
  const overdueTasksByDate = useMemo(() => {
    const groupedTasks = {};
    
    overdueTasks.forEach(task => {
      const date = task.dueDate;
      if (!groupedTasks[date]) {
        groupedTasks[date] = [];
      }
      groupedTasks[date].push(task);
    });
    
    // Sort dates in descending order (most recent first)
    return Object.keys(groupedTasks)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((acc, date) => {
        acc[date] = groupedTasks[date];
        return acc;
      }, {});
  }, [overdueTasks]);
  
  // Calculate statistics
  useEffect(() => {
    // Count high priority tasks (both today and upcoming)
    const highPriorityCount = tasks.filter(t => t.urgency > 1 && !t.completed).length;
    
    // Count tasks completed today (checking the completedAt timestamp)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const completedToday = tasks.filter(t => 
      t.completed && 
      t.completedAt && 
      t.completedAt >= startOfDay
    ).length;
    
    // Total tasks count (including completed ones)
    const totalTasks = tasks.length;
    
    setStats({
      highPriorityCount,
      completedToday,
      totalTasks
    });
  }, [tasks]);
  
  // Custom toggle handler with debugging
  const handleToggleCompletion = (taskId) => {
    console.log(`Toggling task with ID: ${taskId}`);
    toggleTaskCompletion(taskId);
  };

  // Custom delete handler with debugging
  const handleDeleteTask = (taskId) => {
    console.log(`Dashboard deleting task with ID: ${taskId}`);
    deleteTask(taskId);
  };

  // Format date to display
  const formatDate = (dateString) => {
    const taskDate = new Date(dateString);
    const dateDiff = Math.floor((new Date(today) - taskDate) / (1000 * 60 * 60 * 24));
    
    // Format the date
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric'
    });
    
    return `${formattedDate} (${dateDiff} ${dateDiff === 1 ? 'day' : 'days'} overdue)`;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-welcome">Welcome, {user?.displayName || 'User'}</h1>  
      <p className="dashboard-date">
        <Clock size={18} className="dashboard-icon" />
        <span>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </p>
      
      {/* Overdue Tasks Container */}
      {overdueTasks.length > 0 && (
        <div className="dashboard-card dashboard-overdue">
          <h2 className="dashboard-card-title">Overdue Tasks ({overdueTasks.length})</h2>
          
          {Object.entries(overdueTasksByDate).map(([date, tasks]) => (
            <div key={date} className="dashboard-overdue-group">
              <h3 className="dashboard-overdue-date">{formatDate(date)} - {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</h3>
              <ul className="dashboard-task-list">
                {tasks.map(task => (
                  <li key={task.id} className="dashboard-task-item dashboard-overdue-item">
                    <TaskItem 
                      task={task}
                      onToggleComplete={handleToggleCompletion}
                      onDelete={handleDeleteTask} // Use the explicit handler
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Today's Overview</h2>
          <ProgressBar percentage={completionPercentage} />
          
          <div className="dashboard-tasks-section">
            <h3 className="dashboard-section-title">Tasks Due Today ({todaysTasks.length})</h3>
            {todaysTasks.length > 0 ? (
              <ul className="dashboard-task-list">
                {todaysTasks.map(task => (
                  <li key={task.id} className="dashboard-task-item">
                    <TaskItem 
                      task={task}
                      onToggleComplete={handleToggleCompletion}
                      onDelete={handleDeleteTask} // Use the explicit handler
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dashboard-empty-message">No tasks due today</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Upcoming Tasks</h2>
          {upcomingTasks.length > 0 ? (
            <ul className="dashboard-upcoming-list">
              {upcomingTasks.map(task => (
                <li key={task.id} className="dashboard-upcoming-item">
                  <TaskItem 
                    task={task}
                    onToggleComplete={handleToggleCompletion}
                    onDelete={handleDeleteTask} // Use the explicit handler
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty-message">No upcoming tasks</p>
          )}
        </div>
      </div>
      
      <div className="dashboard-card dashboard-stats">
        <h2 className="dashboard-card-title">Quick Stats</h2>
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card dashboard-stat-total">
            <p className="dashboard-stat-label">Total Tasks</p>
            <p className="dashboard-stat-value">{stats.totalTasks}</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-completed">
            <p className="dashboard-stat-label">Completed Today</p>
            <p className="dashboard-stat-value">{stats.completedToday}</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-priority">
            <p className="dashboard-stat-label">High Priority</p>
            <p className="dashboard-stat-value">{stats.highPriorityCount}</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-overdue">
            <p className="dashboard-stat-label">Overdue</p>
            <p className="dashboard-stat-value">{overdueTasks.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;