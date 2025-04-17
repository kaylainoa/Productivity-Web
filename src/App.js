// src/App.js
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Sidebar from './components/Sidebar';
import AddTaskFAB from './components/AddTaskFAB';
import { TaskProvider } from './contexts/TaskProvider';
import './styles/App.css';

// Create user context for Firebase auth
export const UserContext = createContext(null);

// Create Firebase tasks context
export const FirebaseTasksContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user: currentUser }}>
      <TaskProvider>
        <Router>
          {currentUser ? (
            <div className="app-container">
              <Sidebar />
              <main className="app-main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <AddTaskFAB />
              </main>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </Router>
      </TaskProvider>
    </UserContext.Provider>
  );
}

export default App;