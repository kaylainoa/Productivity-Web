// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../styles/Login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Successfully signed in
      const user = userCredential.user;
      console.log("Logged in user:", user);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error.code, error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Productivity Hub</h1>
          <p className="login-subtitle">Sign in to manage your tasks</p>
        </div>
        
        {error && (
          <div className="login-error" style={{ 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1rem', 
            fontSize: '0.875rem' 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="login-input-group">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>
        </form>
        
        <div className="login-signup">
          <p className="login-signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="login-signup-link">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="login-demo-note">
          <p className="login-demo-text">
            Please use a valid Firebase account to sign in
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;