// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, Home, LogOut } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { UserContext } from '../App'; // Make sure to create this context in App.js
import '../styles/Sidebar.css';

function Sidebar() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      // Redirect to login page after successful logout
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'sidebar-item-active' : '';
  };

  // Get first letter of display name or email for avatar
  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0);
    if (user?.email) return user.email.charAt(0);
    return '?';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Productivity Hub</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link to="/" className={`sidebar-link ${isActive('/')}`}>
              <Home className="sidebar-icon" size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link to="/tasks" className={`sidebar-link ${isActive('/tasks')}`}>
              <CheckSquare className="sidebar-icon" size={20} />
              <span>Tasks</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link to="/calendar" className={`sidebar-link ${isActive('/calendar')}`}>
              <Calendar className="sidebar-icon" size={20} />
              <span>Calendar</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {getInitial()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.displayName || 'User'}</p>
            <p className="sidebar-user-email">{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout-button">
          <LogOut className="sidebar-icon-small" size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;