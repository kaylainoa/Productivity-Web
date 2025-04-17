// src/contexts/TaskProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const TaskContext = createContext();

export function TaskProvider({ children }) {
  // Initialize with empty tasks array instead of sample tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Validate that we have an array of tasks
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
        console.warn("Invalid tasks data found in localStorage, using empty array");
        return [];
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        return [];
      }
    }
    return []; // Start with empty array instead of initial sample tasks
  });
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Get today's date as YYYY-MM-DD
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Function to get tasks due today
  const getTodaysTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => task.dueDate === today);
  };

  // Function to get upcoming tasks
  const getUpcomingTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => 
      task.dueDate > today && !task.completed
    );
  };

  // Function to get overdue tasks
  const getOverdueTasks = () => {
    const today = getTodayDateString();
    return tasks.filter(task => 
      task.dueDate < today && !task.completed
    );
  };

  // Function to calculate completion percentage
  const getTodaysCompletionPercentage = () => {
    const todaysTasks = getTodaysTasks();
    if (todaysTasks.length === 0) return 100;
    
    const completedCount = todaysTasks.filter(task => task.completed).length;
    return Math.round((completedCount / todaysTasks.length) * 100);
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (taskId) => {
    console.log(`Provider toggling task with ID: ${taskId}`);
    
    setTasks(prevTasks => {
      // Find the task by ID
      const taskIndex = prevTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        console.error(`Task with ID ${taskId} not found`);
        return prevTasks;
      }
      
      // Create a new array with the updated task
      const updatedTasks = [...prevTasks];
      const task = updatedTasks[taskIndex];
      
      updatedTasks[taskIndex] = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null
      };
      
      return updatedTasks;
    });
  };

  // Function to add a new task with unique ID
  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(), // Ensure unique ID using timestamp
      completed: false,
      completedAt: null
    };
    
    setTasks(prevTasks => [...prevTasks, taskWithId]);
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