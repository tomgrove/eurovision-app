import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  if (loading) {
    return <div className="loading-screen">🎵 Loading Eurovision...</div>;
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

