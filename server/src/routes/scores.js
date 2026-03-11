const express = require('express');
const router = express.Router();
const { Score, Performer, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  try {
    const { performerId, score, comment } = req.body;
    
    if (!performerId || score === undefined || score === null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (score < 0 || score > 12) {
      return res.status(400).json({ error: 'Score must be between 0 and 12' });
    }
    
    const performer = await Performer.findByPk(performerId);
    if (!performer) {
      return res.status(404).json({ error: 'Performer not found' });
    }
    
    const [scoreRecord, created] = await Score.findOrCreate({
      where: { userId: req.userId, performerId },
      defaults: { score, comment },
    });
    
    if (!created) {
      scoreRecord.score = score;
      scoreRecord.comment = comment;
      await scoreRecord.save();
    }
    
    res.status(201).json({
      message: 'Score submitted successfully',
      score: scoreRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/scores', authenticate, async (req, res) => {
  try {
    const scores = await Score.findAll({
      where: { userId: req.userId },
      include: [{ model: Performer }],
    });
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/compare/:userId', authenticate, async (req, res) => {
  try {
    const currentUserScores = await Score.findAll({
      where: { userId: req.userId },
      include: [{ model: Performer, attributes: ['id', 'country', 'artistName'] }],
    });
    
    const otherUserScores = await Score.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Performer, attributes: ['id', 'country', 'artistName'] }],
    });
    
    const otherUser = await User.findByPk(req.params.userId, {
      attributes: ['id', 'displayName', 'username'],
    });
    
    res.json({
      currentUser: { id: req.userId, scores: currentUserScores },
      otherUser: { ...otherUser.dataValues, scores: otherUserScores },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List users who have submitted scores (excluding current user)
router.get('/users', authenticate, async (req, res) => {
  try {
    const allScores = await Score.findAll({ attributes: ['userId'] });
    const userIds = [...new Set(allScores.map(s => s.userId))].filter(id => id !== req.userId);
    const scoringUsers = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'username', 'displayName'],
    });
    const result = scoringUsers.map(u => {
      const count = allScores.filter(s => s.userId === u.id).length;
      return { id: u.id, username: u.username, displayName: u.displayName, scoreCount: count };
    });
    result.sort((a, b) => b.scoreCount - a.scoreCount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
