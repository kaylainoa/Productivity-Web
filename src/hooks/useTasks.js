// // src/hooks/useTasks.js
// import { useState, useEffect } from 'react';

// // Sample initial tasks for new users only
// const initialTasks = [
//   { id: 1, title: "Complete project proposal", completed: false, dueDate: "2025-04-17", urgency: 2, completedAt: null },
//   { id: 2, title: "Review team documentation", completed: false, dueDate: "2025-04-16", urgency: 1, completedAt: null },
//   { id: 3, title: "Schedule client meeting", completed: true, dueDate: "2025-04-15", urgency: 0, completedAt: 1713241200000 },
//   { id: 4, title: "Update portfolio website", completed: false, dueDate: "2025-04-20", urgency: 1, completedAt: null },
//   { id: 5, title: "Submit quarterly report", completed: false, dueDate: "2025-04-16", urgency: 2, completedAt: null },
//   { id: 6, title: "Project kickoff meeting", completed: false, dueDate: "2025-04-15", urgency: 2, completedAt: null },
//   { id: 7, title: "Send invoices to clients", completed: false, dueDate: "2025-04-14", urgency: 1, completedAt: null },
// ];

// export default function useTasks() {
//   // Load tasks from localStorage or use initialTasks if not found
//   const [tasks, setTasks] = useState(() => {
//     const savedTasks = localStorage.getItem('tasks');
//     return savedTasks ? JSON.parse(savedTasks) : initialTasks;
//   });
  
//   // Save tasks to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   }, [tasks]);
  
//   // Add new task
//   const addTask = (task) => {
//     if (task.title.trim() !== '') {
//       const newTask = {
//         id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
//         title: task.title,
//         completed: false,
//         dueDate: task.dueDate,
//         urgency: task.urgency,
//         completedAt: null
//       };
//       setTasks([...tasks, newTask]);
//       return true;
//     }
//     return false;
//   };

//   // Toggle task completion
//   const toggleTaskCompletion = (id) => {
//     setTasks(
//       tasks.map(task =>
//         task.id === id
//           ? {
//               ...task,
//               completed: !task.completed,
//               completedAt: !task.completed ? Date.now() : null
//             }
//           : task
//       )
//     );
//   };
  
//   // Delete a task
//   const deleteTask = (id) => {
//     setTasks(tasks.filter(task => task.id !== id));
//   };

//   // Get today's tasks
//   const getTodaysTasks = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return tasks.filter(task => task.dueDate === today);
//   };
  
//   // Get overdue tasks
//   const getOverdueTasks = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return tasks.filter(task => 
//       task.dueDate < today && !task.completed
//     );
//   };
  
//   // Get upcoming tasks
//   const getUpcomingTasks = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return tasks.filter(task => task.dueDate > today);
//   };
  
//   // Calculate completion percentage for today's tasks
//   const getTodaysCompletionPercentage = () => {
//     const todaysTasks = getTodaysTasks();
    
//     if (todaysTasks.length === 0) return 100;
    
//     const completedCount = todaysTasks.filter(task => task.completed).length;
//     return Math.round((completedCount / todaysTasks.length) * 100);
//   };
  
//   // Search tasks by title
//   const searchTasks = (query) => {
//     if (!query || query.trim() === '') return tasks;
    
//     const lowercaseQuery = query.toLowerCase();
//     return tasks.filter(task => 
//       task.title.toLowerCase().includes(lowercaseQuery)
//     );
//   };

//   return {
//     tasks,
//     addTask,
//     toggleTaskCompletion,
//     deleteTask,
//     getTodaysTasks,
//     getUpcomingTasks,
//     getOverdueTasks,
//     getTodaysCompletionPercentage,
//     searchTasks
//   };
// }