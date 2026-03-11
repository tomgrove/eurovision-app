const express = require('express');
const router = express.Router();
const { Performer, Score, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const performers = await Performer.findAll({
      order: [['country', 'ASC']],
    });
    res.json(performers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const performers = await Performer.findAll();
    const leaderboard = await Promise.all(performers.map(async (p) => {
      const scores = await Score.findAll({ where: { performerId: p.id }, attributes: ['score'] });
      const totalVotes = scores.length;
      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      const averageScore = totalVotes > 0 ? totalScore / totalVotes : 0;
      return { id: p.id, country: p.country, artistName: p.artistName, songTitle: p.songTitle, countryCode: p.countryCode, totalVotes, totalScore, averageScore: parseFloat(averageScore.toFixed(2)) };
    }));
    leaderboard.sort((a, b) => b.totalScore - a.totalScore || b.averageScore - a.averageScore);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const performer = await Performer.findByPk(req.params.id, {
      include: {
        model: Score,
        include: [{ model: User, attributes: ['id', 'displayName'] }],
      },
    });
    
    if (!performer) {
      return res.status(404).json({ error: 'Performer not found' });
    }
    
    res.json(performer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/average', async (req, res) => {
  try {
    const scores = await Score.findAll({
      where: { performerId: req.params.id },
      attributes: ['score'],
    });
    
    if (scores.length === 0) {
      return res.json({ averageScore: 0, totalRatings: 0 });
    }
    
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    const average = sum / scores.length;
    
    res.json({ averageScore: average.toFixed(2), totalRatings: scores.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
