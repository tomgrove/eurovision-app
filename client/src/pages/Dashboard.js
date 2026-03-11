import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Dashboard.css';
import { useAuth } from '../AuthContext';
import { performersAPI, scoresAPI } from '../api';
import PerformerCard from '../components/PerformerCard';
import confetti from 'canvas-confetti';

const countryCodeToFlag = (code) => {
  if (!code || code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [performers, setPerformers] = useState([]);
  const [userScores, setUserScores] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('score');

  // Compare state
  const [compareUsers, setCompareUsers] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Leader change detection
  const prevLeaderRef = useRef(null);
  const [newLeaderBanner, setNewLeaderBanner] = useState(null);

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#0a1e3d', '#1a3a6b', '#ffffff', '#d4213d', '#f5a623'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  useEffect(() => {
    if (leaderboard.length === 0) return;
    const topWithVotes = leaderboard.find(p => p.totalVotes > 0);
    if (!topWithVotes) return;
    const newLeaderId = topWithVotes.id;
    if (prevLeaderRef.current !== null && prevLeaderRef.current !== newLeaderId) {
      setNewLeaderBanner(topWithVotes);
      fireConfetti();
      setTimeout(() => setNewLeaderBanner(null), 5000);
    }
    prevLeaderRef.current = newLeaderId;
  }, [leaderboard, fireConfetti]);

  useEffect(() => {
    loadPerformers();
    loadUserScores();
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') loadLeaderboard();
    if (activeTab === 'compare') loadCompareUsers();
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

  const loadUserScores = async () => {
    try {
      const response = await scoresAPI.getUserScores();
      const scoreMap = {};
      response.data.forEach(s => {
        const pId = s.Performer?.id || s.performerId;
        scoreMap[pId] = s.score;
      });
      setUserScores(scoreMap);
    } catch (error) {
      console.error('Error loading user scores:', error);
    }
  };

  const handleScoreSubmit = () => {
    loadUserScores();
    loadLeaderboard();
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

  const loadCompareUsers = async () => {
    setCompareLoading(true);
    setSelectedUser(null);
    setComparison(null);
    try {
      const response = await scoresAPI.getUsers();
      setCompareUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setCompareLoading(false);
    }
  };

  const loadComparison = async (otherUser) => {
    setSelectedUser(otherUser);
    setComparisonLoading(true);
    try {
      const response = await scoresAPI.compare(otherUser.id);
      setComparison(response.data);
    } catch (error) {
      console.error('Error loading comparison:', error);
    } finally {
      setComparisonLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/eurovision-logo.jpg" alt="Eurovision 2026 Vienna" className="header-logo" />
          <h1>Eurovision 2026</h1>
        </div>
        <div className="header-right">
          <span className="user-greeting">Welcome, {user?.displayName || user?.username}! 👋</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {newLeaderBanner && (
        <div className="new-leader-banner">
          <span className="nlb-trophy">🏆</span>
          <span className="nlb-text">
            New #1: {countryCodeToFlag(newLeaderBanner.countryCode)} {newLeaderBanner.country} — {newLeaderBanner.artistName}!
          </span>
        </div>
      )}

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
        <button
          className={`nav-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          👥 Compare
        </button>
      </nav>

      <main className="dashboard-content">
        <section className="scoring-section" style={{ display: activeTab === 'score' ? 'block' : 'none' }}>
          <h2>Rate Your Favorite Performances</h2>
          {loading ? (
            <div className="loading">Loading performers...</div>
          ) : (
            <div className="performers-grid">
              {performers.map((performer) => (
                <PerformerCard
                  key={performer.id}
                  performer={performer}
                  initialScore={userScores[performer.id] || 0}
                  onScoreSubmit={handleScoreSubmit}
                />
              ))}
            </div>
          )}
        </section>

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
        {activeTab === 'compare' && (
          <section className="compare-section">
            {!selectedUser ? (
              <>
                <h2>👥 Compare Scores</h2>
                {compareLoading ? (
                  <div className="loading">Loading users...</div>
                ) : compareUsers.length === 0 ? (
                  <div className="compare-empty">No other users have scored yet.</div>
                ) : (
                  <div className="compare-user-list">
                    {compareUsers.map(u => (
                      <button key={u.id} className="compare-user-row" onClick={() => loadComparison(u)}>
                        <span className="cu-name">{u.displayName || u.username}</span>
                        <span className="cu-count">{u.scoreCount} score{u.scoreCount !== 1 ? 's' : ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="compare-header">
                  <button className="compare-back" onClick={() => { setSelectedUser(null); setComparison(null); }}>← Back</button>
                  <h2>You vs {selectedUser.displayName || selectedUser.username}</h2>
                </div>
                {comparisonLoading ? (
                  <div className="loading">Loading comparison...</div>
                ) : comparison ? (
                  <div className="compare-list">
                    <div className="compare-legend">
                      <span className="cl-you">You</span>
                      <span className="cl-them">{selectedUser.displayName || selectedUser.username}</span>
                    </div>
                    {performers.map(p => {
                      const myScore = comparison.currentUser.scores.find(s => (s.Performer?.id || s.performerId) === p.id);
                      const theirScore = comparison.otherUser?.scores.find(s => (s.Performer?.id || s.performerId) === p.id);
                      const myVal = myScore ? myScore.score : null;
                      const theirVal = theirScore ? theirScore.score : null;
                      return (
                        <div key={p.id} className="compare-row">
                          <span className="cr-flag">{countryCodeToFlag(p.countryCode)}</span>
                          <span className="cr-country">{p.country}</span>
                          <div className="cr-scores">
                            <span className={`cr-score cr-mine ${myVal !== null && theirVal !== null ? (myVal > theirVal ? 'higher' : myVal < theirVal ? 'lower' : 'equal') : ''}`}>
                              {myVal !== null ? myVal : '–'}
                            </span>
                            <span className="cr-vs">vs</span>
                            <span className={`cr-score cr-theirs ${theirVal !== null && myVal !== null ? (theirVal > myVal ? 'higher' : theirVal < myVal ? 'lower' : 'equal') : ''}`}>
                              {theirVal !== null ? theirVal : '–'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
