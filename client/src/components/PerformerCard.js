import React, { useEffect, useState } from 'react';
import './PerformerCard.css';
import { scoresAPI } from '../api';

const PerformerCard = ({ performer, onScoreSubmit }) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await scoresAPI.submit(performer.id, score, comment);
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
      {performer.imageUrl && (
        <img src={performer.imageUrl} alt={performer.country} className="performer-image" />
      )}
      <div className="performer-content">
        <h3>{performer.country}</h3>
        <p className="artist">{performer.artistName}</p>
        <p className="song">{performer.songTitle}</p>

        <div className="scoring-section">
          <div className="score-display">
            <span className="current-score">{score}</span>
            <span className="max-score">/5</span>
          </div>

          <input
            type="range"
            min="0"
            max="5"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="score-slider"
            disabled={loading}
          />

          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
            disabled={loading}
            rows="2"
          />

          <button
            onClick={handleSubmit}
            className={`submit-btn ${submitted ? 'submitted' : ''}`}
            disabled={loading}
          >
            {submitted ? '✓ Submitted' : loading ? 'Submitting...' : 'Submit Score'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformerCard;
