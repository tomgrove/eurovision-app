import React, { useState } from 'react';
import './Signup.css';
import { useAuth } from '../AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/eurovision-logo.jpg" alt="Eurovision 2026 Vienna" className="auth-logo" />
        <h1>Eurovision Scoring</h1>
        <h2>Create Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="text"
            name="displayName"
            placeholder="Display Name (optional)"
            value={formData.displayName}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <button type="button" onClick={onSwitchToLogin} className="link-button">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
