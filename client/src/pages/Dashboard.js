import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAuth } from '../AuthContext';
import { performersAPI, scoresAPI } from '../api';
import PerformerCard from '../components/PerformerCard';

const countryCodeToFlag = (code) => {
  if (!code || code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [performers, setPerformers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('score');

  useEffect(() => {
    loadPerformers();
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') loadLeaderboard();
  }, [activeTab]);

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

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const response = await performersAPI.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLeaderboardLoading(false);
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
            {leaderboardLoading ? (
              <div className="loading">Loading leaderboard...</div>
            ) : leaderboard.length === 0 || leaderboard.every(p => p.totalVotes === 0) ? (
              <div className="leaderboard-empty">No votes yet — be the first to score!</div>
            ) : (
              <div className="leaderboard-list">
                {leaderboard.map((p, idx) => (
                  <div key={p.id} className={`leaderboard-row ${idx < 3 ? 'top-three' : ''}`}>
                    <span className="lb-rank">{idx + 1}</span>
                    <span className="lb-flag">{countryCodeToFlag(p.countryCode)}</span>
                    <div className="lb-info">
                      <span className="lb-country">{p.country}</span>
                      <span className="lb-artist">{p.artistName}</span>
                    </div>
                    <div className="lb-stats">
                      <span className="lb-total">{p.totalScore} pts</span>
                      <span className="lb-votes">{p.totalVotes} vote{p.totalVotes !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
