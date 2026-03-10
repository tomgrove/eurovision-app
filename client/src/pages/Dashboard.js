import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAuth } from '../AuthContext';
import { performersAPI, scoresAPI } from '../api';
import PerformerCard from '../components/PerformerCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('score');

  useEffect(() => {
    loadPerformers();
  }, []);

  const loadPerformers = async () => {
    try {
      const response = await performersAPI.getAll();
      setPerformers(response.data);
    } catch (error) {
      console.error('Error loading performers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎵 Eurovision 2026</h1>
        <div className="header-right">
          <span className="user-greeting">Welcome, {user?.displayName || user?.username}! 👋</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'score' ? 'active' : ''}`}
          onClick={() => setActiveTab('score')}
        >
          🎤 Score Performers
        </button>
        <button
          className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'score' && (
          <section className="scoring-section">
            <h2>Rate Your Favorite Performances</h2>
            {loading ? (
              <div className="loading">Loading performers...</div>
            ) : (
              <div className="performers-grid">
                {performers.map((performer) => (
                  <PerformerCard
                    key={performer.id}
                    performer={performer}
                    onScoreSubmit={loadPerformers}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'leaderboard' && (
          <section className="leaderboard-section">
            <h2>🏅 Top Performers</h2>
            <div className="coming-soon">
              Coming soon: Compare your scores with friends and see leaderboards!
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
