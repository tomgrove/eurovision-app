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
    
    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 0 and 5' });
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

module.exports = router;
