// src/contexts/TaskProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Get today's date as YYYY-MM-DD
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Function to get tasks due today - only return tasks with today's due date
  const getTodaysTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => task.dueDate === today);
  };

  // Function to get upcoming tasks (due after today) - only return tasks with future dates
  const getUpcomingTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => 
      task.dueDate > today && !task.completed
    );
  };

  // Function to get overdue tasks - only return tasks with past dates
  const getOverdueTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => 
      task.dueDate < today && !task.completed
    );
  };

  // Function to calculate completion percentage for today's tasks
  const getTodaysCompletionPercentage = () => {
    const todaysTasks = getTodaysTasks();
    if (todaysTasks.length === 0) return 100; // No tasks = 100% complete
    
    const completedCount = todaysTasks.filter(task => task.completed).length;
    return Math.round((completedCount / todaysTasks.length) * 100);
  };

  // Function to toggle task completion with ID-only approach
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const now = new Date().getTime();
          return { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? now : null
          };
        }
        return task;
      })
    );
  };

  // Function to add a new task
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Function to update a task
  const updateTask = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const value = {
    tasks,
    getTodaysTasks,
    getUpcomingTasks,
    getOverdueTasks,
    getTodaysCompletionPercentage,
    toggleTaskCompletion,
    addTask,
    deleteTask,
    updateTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the task context
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}