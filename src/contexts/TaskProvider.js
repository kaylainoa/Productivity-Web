// src/contexts/TaskProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? currentUser.uid : "no user");
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch tasks when user authentication state changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    const fetchTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        console.log("Setting up task listener for user:", user.uid);
        // Create a query for the current user's tasks
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
          // Note: Removed orderBy as it requires a composite index
        );
        
        // Set up a real-time listener
        unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
          console.log("Received task update, document count:", snapshot.docs.length);
          const userTasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTasks(userTasks);
          setLoading(false);
        }, (error) => {
          console.error("Error listening for task updates:", error);
          setLoading(false);
        });
        
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
    
    // Clean up the subscription
    return () => unsubscribe();
  }, [user]);
  
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

  // Function to search tasks
  const searchTasks = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerCaseQuery)
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
  const toggleTaskCompletion = async (taskId) => {
    if (!user) {
      console.warn("Cannot toggle task: No authenticated user");
      return;
    }
    
    try {
      // Find the task in the current state
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        console.error(`Task with ID ${taskId} not found`);
        return;
      }
      
      console.log("Toggling completion for task:", taskId);
      
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !taskToUpdate.completed,
        completedAt: !taskToUpdate.completed ? new Date().toISOString() : null
        // Note: Removed serverTimestamp() as it may cause issues
      });
      
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Function to add a new task
  const addTask = async (newTask) => {
    if (!user) {
      console.warn("Cannot add task: No authenticated user");
      return false;
    }
    
    if (!newTask.title || !newTask.title.trim()) {
      console.warn("Cannot add task: Empty title");
      return false;
    }
    
    try {
      console.log("Adding new task for user:", user.uid);
      
      // Add task to Firestore
      const taskData = {
        userId: user.uid,
        title: newTask.title.trim(),
        dueDate: newTask.dueDate || getTodayDateString(),
        urgency: newTask.urgency !== undefined ? newTask.urgency : 0,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString() // Use ISO string instead of serverTimestamp
      };
      
      console.log("Task data to add:", taskData);
      
      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      console.log("Task added with ID:", docRef.id);
      
      return true; // Indicate success
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    if (!user) {
      console.warn("Cannot delete task: No authenticated user");
      return;
    }
    
    try {
      console.log("Deleting task:", taskId);
      
      // Delete the task from Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to update a task
  const updateTask = async (updatedTask) => {
    if (!user) {
      console.warn("Cannot update task: No authenticated user");
      return;
    }
    
    try {
      console.log("Updating task:", updatedTask.id);
      
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', updatedTask.id);
      
      // Remove the id from the data to update
      const { id, ...dataToUpdate } = updatedTask;
      
      await updateDoc(taskRef, dataToUpdate);
      
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const value = {
    tasks,
    loading,
    user,
    getTodaysTasks,
    getUpcomingTasks,
    getOverdueTasks,
    getTodaysCompletionPercentage,
    toggleTaskCompletion,
    addTask,
    deleteTask,
    updateTask,
    searchTasks
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

