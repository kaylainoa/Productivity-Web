// src/hooks/useTasks.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/Firebase';
import { 
  collection, 
  doc, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const tasksQuery = query(tasksRef, orderBy('dueDate', 'asc'));

    const unsubscribe = onSnapshot(
      tasksQuery, 
      (snapshot) => {
        const taskList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading tasks:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task) => {
    if (!user || task.title.trim() === '') return false;

    try {
      const taskData = {
        title: task.title,
        completed: false,
        dueDate: task.dueDate,
        urgency: parseInt(task.urgency),
        completedAt: null,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'users', user.uid, 'tasks'), taskData);
      return true;
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message);
      return false;
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    if (!user) return;

    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      const newCompletedStatus = !taskToUpdate.completed;

      await updateDoc(taskRef, {
        completed: newCompletedStatus,
        completedAt: newCompletedStatus ? serverTimestamp() : null
      });

      // Manually update local state to reflect change immediately
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: newCompletedStatus, completedAt: newCompletedStatus ? Date.now() : null }
          : task
      ));

    } catch (err) {
      console.error("Error toggling task completion:", err);
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message);
    }
  };

  const formatFirestoreDate = (dateField) => {
    if (typeof dateField === 'string') return dateField;
    if (dateField && dateField.seconds) {
      return new Date(dateField.seconds * 1000).toISOString().split('T')[0];
    }
    return '';
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => formatFirestoreDate(task.dueDate) === today);
  };

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => formatFirestoreDate(task.dueDate) < today && !task.completed);
  };

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => formatFirestoreDate(task.dueDate) > today);
  };

  const getTodaysCompletionPercentage = () => {
    const todaysTasks = getTodaysTasks();
    if (todaysTasks.length === 0) return 100;
    const completedCount = todaysTasks.filter(task => task.completed).length;
    return Math.round((completedCount / todaysTasks.length) * 100);
  };

  const searchTasks = (query) => {
    if (!query || query.trim() === '') return tasks;
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => task.title.toLowerCase().includes(lowercaseQuery));
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    getTodaysTasks,
    getUpcomingTasks,
    getOverdueTasks,
    getTodaysCompletionPercentage,
    searchTasks
  };
}