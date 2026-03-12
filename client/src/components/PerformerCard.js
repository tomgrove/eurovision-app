import React from 'react';
import './PerformerCard.css';
import { scoresAPI } from '../api';

const countryCodeToFlag = (code) => {
  if (!code || code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
};

const PerformerCard = ({ performer, score, maxScore, onScoreChange, onScoreSubmit }) => {
  const submitRef = React.useRef(null);

  const changeScore = (newScore) => {
    onScoreChange(performer.id, newScore);
    // Debounce: cancel previous pending submit, schedule new one
    if (submitRef.current) clearTimeout(submitRef.current);
    submitRef.current = setTimeout(async () => {
      try {
        await scoresAPI.submit(performer.id, newScore, '');
        onScoreSubmit();
      } catch (error) {
        console.error('Error submitting score:', error);
      }
    }, 400);
  };

  const increment = () => { if (score < maxScore) changeScore(score + 1); };
  const decrement = () => { if (score > 0) changeScore(score - 1); };

  return (
    <div className="performer-card">
      <span className="performer-flag">{countryCodeToFlag(performer.countryCode)}</span>
      <div className="performer-info">
        <h3>{performer.country}</h3>
        <p className="artist">{performer.artistName}</p>
        <p className="song">{performer.songTitle}</p>
      </div>
      <div className="card-scoring">
        <button className="score-arrow" onClick={decrement} disabled={score <= 0}>▼</button>
        <span className="current-score">{score}</span>
        <button className="score-arrow" onClick={increment} disabled={score >= maxScore}>▲</button>
      </div>
    </div>
  );
};

export default PerformerCard;
