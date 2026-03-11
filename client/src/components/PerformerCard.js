import React, { useState } from 'react';
import './PerformerCard.css';
import { scoresAPI } from '../api';

const countryCodeToFlag = (code) => {
  if (!code || code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
};

const PerformerCard = ({ performer, score, maxScore, onScoreChange, onScoreSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSliderChange = (e) => {
    onScoreChange(performer.id, parseInt(e.target.value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await scoresAPI.submit(performer.id, score, '');
      setSubmitted(true);
      onScoreSubmit();
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="performer-card">
      <span className="performer-flag">{countryCodeToFlag(performer.countryCode)}</span>
      <div className="performer-info">
        <h3>{performer.country}</h3>
        <p className="artist">{performer.artistName}</p>
        <p className="song">{performer.songTitle}</p>
      </div>
      <div className="card-scoring">
        <div className="score-display">
          <span className="current-score">{score}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxScore}
          value={score}
          onChange={handleSliderChange}
          className="score-slider"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className={`submit-btn ${submitted ? 'submitted' : ''}`}
          disabled={loading}
        >
          {submitted ? '✓' : loading ? '...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default PerformerCard;
