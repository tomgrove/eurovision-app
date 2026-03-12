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

  const FLAG_COLORS = {
    AL: ['#e41e20', '#000000'],
    AM: ['#d90012', '#0033a0', '#f2a800'],
    AU: ['#00008b', '#ffffff', '#ff0000'],
    AT: ['#ed2939', '#ffffff'],
    AZ: ['#00b5e2', '#ed2939', '#3f9c35'],
    BE: ['#000000', '#fae042', '#ed2939'],
    BG: ['#ffffff', '#00966e', '#d62612'],
    HR: ['#ff0000', '#ffffff', '#171796'],
    CY: ['#ffffff', '#d47600'],
    CZ: ['#11457e', '#d7141a', '#ffffff'],
    DK: ['#c8102e', '#ffffff'],
    EE: ['#0072ce', '#000000', '#ffffff'],
    FI: ['#ffffff', '#003580'],
    FR: ['#002395', '#ffffff', '#ed2939'],
    GE: ['#ffffff', '#ff0000'],
    DE: ['#000000', '#dd0000', '#ffcc00'],
    GR: ['#0d5eaf', '#ffffff'],
    IL: ['#0038b8', '#ffffff'],
    IT: ['#009246', '#ffffff', '#ce2b37'],
    LV: ['#9e3039', '#ffffff'],
    LT: ['#fdb913', '#006a44', '#c1272d'],
    LU: ['#ed2939', '#ffffff', '#00a1de'],
    MT: ['#ffffff', '#cf142b'],
    MD: ['#003da5', '#fcd116', '#cc092f'],
    ME: ['#d4af37', '#cc0000'],
    NO: ['#ef2b2d', '#ffffff', '#002868'],
    PL: ['#ffffff', '#dc143c'],
    PT: ['#006600', '#ff0000', '#ffcc00'],
    RO: ['#002b7f', '#fcd116', '#ce1126'],
    SM: ['#5eb6e4', '#ffffff'],
    RS: ['#c6363c', '#0c4076', '#ffffff'],
    SE: ['#006aa7', '#fecc00'],
    CH: ['#ff0000', '#ffffff'],
    UA: ['#005bbb', '#ffd500'],
    GB: ['#00247d', '#cf142b', '#ffffff'],
  };

  const fireConfetti = useCallback((countryCode) => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = FLAG_COLORS[countryCode] || ['#ffffff', '#d4213d', '#f5a623'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  useEffect(() => {
    if (leaderboard.length < 2) return;
    const topWithVotes = leaderboard.find(p => p.totalVotes > 0);
    if (!topWithVotes) return;
    const second = leaderboard.find(p => p.totalVotes > 0 && p.id !== topWithVotes.id);
    const isClearLeader = !second || topWithVotes.totalScore > second.totalScore;
    const newLeaderId = topWithVotes.id;
    if (prevLeaderRef.current !== null && prevLeaderRef.current !== newLeaderId && isClearLeader) {
      setNewLeaderBanner(topWithVotes);
      fireConfetti(topWithVotes.countryCode);
      setTimeout(() => setNewLeaderBanner(null), 5000);
    }
    prevLeaderRef.current = newLeaderId;
  }, [leaderboard, fireConfetti]);

  useEffect(() => {
    loadPerformers();
    loadUserScores();
    loadLeaderboard();
  }, []);

  // Poll leaderboard every 8 seconds for real-time updates from other users
  useEffect(() => {
    const interval = setInterval(loadLeaderboard, 8000);
    return () => clearInterval(interval);
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

  const POINT_POOL = 12;

  const pointsUsed = Object.values(userScores).reduce((sum, s) => sum + s, 0);
  const pointsRemaining = POINT_POOL - pointsUsed;

  const handleScoreChange = (performerId, newScore) => {
    setUserScores(prev => ({ ...prev, [performerId]: newScore }));
  };

  const handleScoreSubmit = () => {
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
          <div className="points-pool">
            <span className="points-remaining">{pointsRemaining}</span>
            <span className="points-label">points remaining</span>
          </div>
          {loading ? (
            <div className="loading">Loading performers...</div>
          ) : (
            <div className="performers-grid">
              {performers.map((performer) => {
                const currentScore = userScores[performer.id] || 0;
                const maxForThis = currentScore + pointsRemaining;
                return (
                  <PerformerCard
                    key={performer.id}
                    performer={performer}
                    score={currentScore}
                    maxScore={Math.min(12, maxForThis)}
                    onScoreChange={handleScoreChange}
                    onScoreSubmit={handleScoreSubmit}
                  />
                );
              })}
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
                  <div key={p.id} className={`leaderboard-row ${idx < 3 ? 'top-three' : ''} ${idx < 3 ? `rank-${idx + 1}` : ''}`}>
                    <span className="lb-rank">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</span>
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
