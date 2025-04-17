// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import '../styles/SignUp.css';

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add display name to the user
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      // Successfully created account
      console.log("Account created:", userCredential.user);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error("Signup error:", error.code, error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Productivity Hub</h1>
          <p className="signup-subtitle">Create your account</p>
        </div>
        
        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-input-group">
            <label className="signup-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="signup-input"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="signup-input-group">
            <label className="signup-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="signup-input-group">
            <label className="signup-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="signup-input-group">
            <label className="signup-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="signup-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="signup-button"
          >
            Create Account
          </button>
        </form>
        
        <div className="signup-login">
          <p className="signup-login-text">
            Already have an account?{' '}
            <Link to="/" className="signup-login-link">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="signup-terms">
          <p className="signup-terms-text">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;