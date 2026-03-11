/*
  Self-contained serverless API entrypoint.
  - When DATABASE_URL is set: uses Sequelize + Postgres with inline models.
  - When DATABASE_URL is NOT set: falls back to in-memory arrays.
*/

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Explicitly require pg so Vercel's bundler includes it (Sequelize loads it dynamically)
try { require('pg'); } catch (_) {}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const SEED_PERFORMERS = [
  { country: 'Albania', artistName: 'Alis', songTitle: 'Nân', countryCode: 'AL', semifinal: 2 },
  { country: 'Armenia', artistName: 'Simon', songTitle: 'TBA', countryCode: 'AM', semifinal: 2 },
  { country: 'Australia', artistName: 'Delta Goodrem', songTitle: 'Eclipse', countryCode: 'AU', semifinal: 2 },
  { country: 'Austria', artistName: 'Cosmó', songTitle: 'Tanzschein', countryCode: 'AT', semifinal: null },
  { country: 'Azerbaijan', artistName: 'JIVA', songTitle: 'Just Go', countryCode: 'AZ', semifinal: 2 },
  { country: 'Belgium', artistName: 'ESSYLA', songTitle: 'Dancing on the Ice', countryCode: 'BE', semifinal: 1 },
  { country: 'Bulgaria', artistName: 'DARA', songTitle: 'Bangaranga', countryCode: 'BG', semifinal: 2 },
  { country: 'Croatia', artistName: 'LELEK', songTitle: 'Andromeda', countryCode: 'HR', semifinal: 1 },
  { country: 'Cyprus', artistName: 'Antigoni', songTitle: 'JALLA', countryCode: 'CY', semifinal: 2 },
  { country: 'Czechia', artistName: 'Daniel Zizka', songTitle: 'CROSSROADS', countryCode: 'CZ', semifinal: 2 },
  { country: 'Denmark', artistName: 'Søren Torpegaard Lund', songTitle: 'Før Vi Går Hjem', countryCode: 'DK', semifinal: 2 },
  { country: 'Estonia', artistName: 'Vanilla Ninja', songTitle: 'Too Epic To Be True', countryCode: 'EE', semifinal: 1 },
  { country: 'Finland', artistName: 'Linda Lampenius x Pete Parkkonen', songTitle: 'Liekinheitin', countryCode: 'FI', semifinal: 1 },
  { country: 'France', artistName: 'Monroe', songTitle: 'Regarde !', countryCode: 'FR', semifinal: null },
  { country: 'Georgia', artistName: 'Bzikebi', songTitle: 'On Replay', countryCode: 'GE', semifinal: 1 },
  { country: 'Germany', artistName: 'Sarah Engels', songTitle: 'Fire', countryCode: 'DE', semifinal: null },
  { country: 'Greece', artistName: 'Akylas', songTitle: 'Ferto', countryCode: 'GR', semifinal: 1 },
  { country: 'Israel', artistName: 'Noam Bettan', songTitle: 'Michelle', countryCode: 'IL', semifinal: 1 },
  { country: 'Italy', artistName: 'Sal Da Vinci', songTitle: 'Per Sempre Sì', countryCode: 'IT', semifinal: null },
  { country: 'Latvia', artistName: 'Atvara', songTitle: 'Ēnā', countryCode: 'LV', semifinal: 2 },
  { country: 'Lithuania', artistName: 'Lion Ceccah', songTitle: 'Sólo Quiero Más', countryCode: 'LT', semifinal: 1 },
  { country: 'Luxembourg', artistName: 'Eva Marija', songTitle: 'Mother Nature', countryCode: 'LU', semifinal: 2 },
  { country: 'Malta', artistName: 'AIDAN', songTitle: 'Bella', countryCode: 'MT', semifinal: 2 },
  { country: 'Moldova', artistName: 'Satoshi', songTitle: 'Viva, Moldova!', countryCode: 'MD', semifinal: 1 },
  { country: 'Montenegro', artistName: 'Tamara Živković', songTitle: 'Nova Zora', countryCode: 'ME', semifinal: 1 },
  { country: 'Norway', artistName: 'JONAS LOVV', songTitle: 'YA YA YA', countryCode: 'NO', semifinal: 2 },
  { country: 'Poland', artistName: 'Alicja', songTitle: 'Pray', countryCode: 'PL', semifinal: 1 },
  { country: 'Portugal', artistName: 'Bandidos do Cante', songTitle: 'Rosa', countryCode: 'PT', semifinal: 1 },
  { country: 'Romania', artistName: 'Alexandra Căpitănescu', songTitle: 'Choke Me', countryCode: 'RO', semifinal: 2 },
  { country: 'San Marino', artistName: 'Senhit', songTitle: 'Superstar', countryCode: 'SM', semifinal: 1 },
  { country: 'Serbia', artistName: 'Lavina', songTitle: 'Kraj Mene', countryCode: 'RS', semifinal: 1 },
  { country: 'Sweden', artistName: 'Felicia', songTitle: 'My System', countryCode: 'SE', semifinal: 1 },
  { country: 'Switzerland', artistName: 'Veronica Fusaro', songTitle: 'Alice', countryCode: 'CH', semifinal: 2 },
  { country: 'Ukraine', artistName: 'Leléka', songTitle: 'Ridnym', countryCode: 'UA', semifinal: 2 },
  { country: 'United Kingdom', artistName: 'LOOK MUM NO COMPUTER', songTitle: 'Eins, Zwei, Drei', countryCode: 'GB', semifinal: null },
];

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

// ---------------------------------------------------------------------------
// Sequelize / Postgres mode (DATABASE_URL is set)
// ---------------------------------------------------------------------------
function buildPostgresApp() {
  const { Sequelize, DataTypes } = require('sequelize');

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false,
  });

  // --- Models ---
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING, allowNull: true },
  }, { timestamps: true, underscored: true });

  const Performer = sequelize.define('Performer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    country: { type: DataTypes.STRING, unique: true, allowNull: false },
    artistName: { type: DataTypes.STRING, allowNull: false },
    songTitle: { type: DataTypes.STRING, allowNull: false },
    countryCode: { type: DataTypes.STRING(2), allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    semifinal: { type: DataTypes.INTEGER, allowNull: true },
  }, { timestamps: true, underscored: true });

  const Score = sequelize.define('Score', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    performerId: { type: DataTypes.UUID, allowNull: false, field: 'performer_id' },
    score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 12 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
  }, {
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'performer_id'] }],
  });

  // --- Associations ---
  Score.belongsTo(User, { foreignKey: 'user_id' });
  Score.belongsTo(Performer, { foreignKey: 'performer_id' });
  User.hasMany(Score, { foreignKey: 'user_id' });
  Performer.hasMany(Score, { foreignKey: 'performer_id' });

  // --- DB init (runs once) ---
  let dbReady = false;
  const initDb = async () => {
    if (dbReady) return;
    await sequelize.sync({ alter: true });
    const count = await Performer.count();
    if (count === 0) {
      await Performer.bulkCreate(SEED_PERFORMERS);
      console.log('Seeded 35 Eurovision 2026 performers');
    }
    dbReady = true;
  };

  // --- Express app ---
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'Server is running' }));

  // Auth: signup
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body || {};
      if (!username || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed, displayName: displayName || username });
      const token = generateToken(user.id);
      return res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ error: 'Email or username already registered' });
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Auth: login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = generateToken(user.id);
      return res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Performers: list
  app.get('/api/performers', async (_req, res) => {
    try {
      const performers = await Performer.findAll({ order: [['country', 'ASC']] });
      res.json(performers);
    } catch (err) {
      console.error('Performers error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Performers: leaderboard
  app.get('/api/performers/leaderboard', async (_req, res) => {
    try {
      const performers = await Performer.findAll({
        include: [{ model: Score, attributes: [] }],
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('Scores.id')), 'totalVotes'],
            [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('Scores.score')), 0), 'totalScore'],
            [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Scores.score')), 0), 'averageScore'],
          ],
        },
        group: ['Performer.id'],
        order: [[sequelize.literal('"totalScore"'), 'DESC']],
        subQuery: false,
      });
      const result = performers.map(p => {
        const plain = p.toJSON();
        plain.totalVotes = parseInt(plain.totalVotes, 10) || 0;
        plain.totalScore = parseInt(plain.totalScore, 10) || 0;
        plain.averageScore = parseFloat(parseFloat(plain.averageScore).toFixed(2)) || 0;
        return plain;
      });
      res.json(result);
    } catch (err) {
      console.error('Leaderboard error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Performers: single with scores
  app.get('/api/performers/:id', async (req, res) => {
    try {
      const performer = await Performer.findByPk(req.params.id, {
        include: [{ model: Score, include: [{ model: User, attributes: ['id', 'displayName'] }] }],
      });
      if (!performer) return res.status(404).json({ error: 'Performer not found' });
      res.json(performer);
    } catch (err) {
      console.error('Performer by id error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Performers: average
  app.get('/api/performers/:id/average', async (req, res) => {
    try {
      const result = await Score.findOne({
        where: { performerId: req.params.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('score')), 'averageScore'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
        ],
      });
      const avg = result && result.getDataValue('averageScore') ? parseFloat(parseFloat(result.getDataValue('averageScore')).toFixed(2)) : 0;
      const total = result ? parseInt(result.getDataValue('totalRatings'), 10) || 0 : 0;
      res.json({ averageScore: avg, totalRatings: total });
    } catch (err) {
      console.error('Average error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Scores: submit
  app.post('/api/scores', authenticate, async (req, res) => {
    try {
      const { performerId, score, comment } = req.body || {};
      if (!performerId || score === undefined || score === null) return res.status(400).json({ error: 'Missing required fields' });
      if (score < 0 || score > 12) return res.status(400).json({ error: 'Score must be between 0 and 12' });
      const performer = await Performer.findByPk(performerId);
      if (!performer) return res.status(404).json({ error: 'Performer not found' });

      // Pool check: sum of user's other scores + this score must be <= 12
      const otherSum = await Score.sum('score', { where: { userId: req.userId, performerId: { [Sequelize.Op.ne]: performerId } } }) || 0;
      if (otherSum + score > 12) return res.status(400).json({ error: `Exceeds your 12-point pool (${12 - otherSum} remaining)` });

      const [entry, created] = await Score.findOrCreate({
        where: { userId: req.userId, performerId },
        defaults: { score, comment },
      });
      if (!created) {
        entry.score = score;
        entry.comment = comment;
        await entry.save();
      }
      return res.status(201).json({ message: 'Score submitted successfully', score: entry });
    } catch (err) {
      console.error('Submit score error:', err);
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Scores: user's scores
  app.get('/api/scores/user/scores', authenticate, async (req, res) => {
    try {
      const userScores = await Score.findAll({ where: { userId: req.userId }, include: [{ model: Performer }] });
      res.json(userScores);
    } catch (err) {
      console.error('User scores error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Scores: compare
  app.get('/api/scores/compare/:userId', authenticate, async (req, res) => {
    try {
      const currentUserScores = await Score.findAll({ where: { userId: req.userId }, include: [{ model: Performer }] });
      const otherUserScores = await Score.findAll({ where: { userId: req.params.userId }, include: [{ model: Performer }] });
      const otherUser = await User.findByPk(req.params.userId, { attributes: ['id', 'displayName', 'username'] });
      res.json({
        currentUser: { id: req.userId, scores: currentUserScores },
        otherUser: otherUser ? { id: otherUser.id, displayName: otherUser.displayName, username: otherUser.username, scores: otherUserScores } : null,
      });
    } catch (err) {
      console.error('Compare error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Scores: users who have scores
  app.get('/api/scores/users', authenticate, async (req, res) => {
    try {
      const rows = await Score.findAll({
        where: { userId: { [Sequelize.Op.ne]: req.userId } },
        attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('Score.id')), 'scoreCount']],
        include: [{ model: User, attributes: ['id', 'username', 'displayName'] }],
        group: ['Score.user_id', 'User.id'],
        order: [[sequelize.literal('"scoreCount"'), 'DESC']],
      });
      const result = rows.map(r => {
        const plain = r.toJSON();
        return { id: plain.User.id, username: plain.User.username, displayName: plain.User.displayName, scoreCount: parseInt(plain.scoreCount, 10) };
      });
      res.json(result);
    } catch (err) {
      console.error('Score users error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // Error handler
  app.use((err, _req, res, _next) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return { app, initDb };
}

// ---------------------------------------------------------------------------
// In-memory mode (no DATABASE_URL)
// ---------------------------------------------------------------------------
function buildMemoryApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let nextUserId = 1;
  const users = [];
  const performers = SEED_PERFORMERS.map((p, i) => ({ id: i + 1, ...p }));
  let nextScoreId = 1;
  const scores = [];

  app.get('/api/health', (_req, res) => res.json({ status: 'Server (in-memory) is running', dbUrlSet: !!process.env.DATABASE_URL, buildError: buildError || null, initError: initError || null }));

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body || {};
      if (!username || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
      if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = { id: nextUserId++, username, email, passwordHash, displayName: displayName || username };
      users.push(user);
      const token = generateToken(user.id);
      return res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error('In-memory signup error:', err);
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = generateToken(user.id);
      return res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error('In-memory login error:', err);
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/performers', (_req, res) => {
    try {
      const sorted = [...performers].sort((a, b) => a.country.localeCompare(b.country));
      res.json(sorted);
    } catch (err) {
      console.error('In-memory performers error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/performers/leaderboard', (_req, res) => {
    try {
      const leaderboard = performers.map(p => {
        const pScores = scores.filter(s => s.performerId === p.id);
        const totalVotes = pScores.length;
        const totalScore = pScores.reduce((sum, s) => sum + s.score, 0);
        const averageScore = totalVotes > 0 ? totalScore / totalVotes : 0;
        return { id: p.id, country: p.country, artistName: p.artistName, songTitle: p.songTitle, countryCode: p.countryCode, totalVotes, totalScore, averageScore: parseFloat(averageScore.toFixed(2)) };
      });
      leaderboard.sort((a, b) => b.totalScore - a.totalScore || b.averageScore - a.averageScore);
      res.json(leaderboard);
    } catch (err) {
      console.error('In-memory leaderboard error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/performers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const performer = performers.find(p => p.id === id);
      if (!performer) return res.status(404).json({ error: 'Performer not found' });
      const performerScores = scores.filter(s => s.performerId === id).map(s => {
        const user = users.find(u => u.id === s.userId) || {};
        return { id: s.id, score: s.score, comment: s.comment, userId: s.userId, User: { id: user.id, displayName: user.displayName } };
      });
      res.json({ ...performer, Scores: performerScores });
    } catch (err) {
      console.error('In-memory performer by id error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/performers/:id/average', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const performerScores = scores.filter(s => s.performerId === id).map(s => s.score);
      if (performerScores.length === 0) return res.json({ averageScore: 0, totalRatings: 0 });
      const sum = performerScores.reduce((a, b) => a + b, 0);
      const avg = sum / performerScores.length;
      res.json({ averageScore: avg.toFixed(2), totalRatings: performerScores.length });
    } catch (err) {
      console.error('In-memory performer average error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.post('/api/scores', authenticate, (req, res) => {
    try {
      const { performerId, score, comment } = req.body || {};
      const pId = parseInt(performerId, 10);
      if (!pId || score === undefined || score === null) return res.status(400).json({ error: 'Missing required fields' });
      if (score < 0 || score > 12) return res.status(400).json({ error: 'Score must be between 0 and 12' });
      const performer = performers.find(p => p.id === pId);
      if (!performer) return res.status(404).json({ error: 'Performer not found' });

      const otherTotal = scores.filter(s => s.userId === req.userId && s.performerId !== pId).reduce((sum, s) => sum + s.score, 0);
      if (otherTotal + score > 12) return res.status(400).json({ error: `Exceeds your 12-point pool (${12 - otherTotal} remaining)` });

      let existing = scores.find(s => s.userId === req.userId && s.performerId === pId);
      if (existing) {
        existing.score = score;
        existing.comment = comment;
      } else {
        existing = { id: nextScoreId++, userId: req.userId, performerId: pId, score, comment };
        scores.push(existing);
      }
      return res.status(201).json({ message: 'Score submitted successfully', score: existing });
    } catch (err) {
      console.error('In-memory submit score error:', err);
      return res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/scores/user/scores', authenticate, (req, res) => {
    try {
      const userScores = scores.filter(s => s.userId === req.userId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      res.json(userScores);
    } catch (err) {
      console.error('In-memory user scores error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/scores/compare/:userId', authenticate, (req, res) => {
    try {
      const otherId = parseInt(req.params.userId, 10);
      const currentUserScores = scores.filter(s => s.userId === req.userId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      const otherUserScores = scores.filter(s => s.userId === otherId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      const otherUser = users.find(u => u.id === otherId) || null;
      res.json({
        currentUser: { id: req.userId, scores: currentUserScores },
        otherUser: otherUser ? { id: otherUser.id, displayName: otherUser.displayName, username: otherUser.username, scores: otherUserScores } : null,
      });
    } catch (err) {
      console.error('In-memory compare error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  app.get('/api/scores/users', authenticate, (req, res) => {
    try {
      const userIds = [...new Set(scores.map(s => s.userId))].filter(id => id !== req.userId);
      const result = userIds.map(uid => {
        const u = users.find(x => x.id === uid);
        if (!u) return null;
        const count = scores.filter(s => s.userId === uid).length;
        return { id: u.id, username: u.username, displayName: u.displayName, scoreCount: count };
      }).filter(Boolean);
      result.sort((a, b) => b.scoreCount - a.scoreCount);
      res.json(result);
    } catch (err) {
      console.error('In-memory users error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  const initDb = async () => {};
  return { app, initDb };
}

// ---------------------------------------------------------------------------
// Build the appropriate app and export the serverless handler
// ---------------------------------------------------------------------------
let app, initDb;
let dbInitialized = false;
let buildError = null;

try {
  const mode = process.env.DATABASE_URL ? 'postgres' : 'memory';
  console.log('API mode:', mode, 'DATABASE_URL set:', !!process.env.DATABASE_URL);
  const built = mode === 'postgres' ? buildPostgresApp() : buildMemoryApp();
  app = built.app;
  initDb = built.initDb;
} catch (buildErr) {
  console.error('Failed to build Postgres app, falling back to in-memory:', buildErr && buildErr.stack ? buildErr.stack : buildErr);
  buildError = buildErr && buildErr.message ? buildErr.message : String(buildErr);
  const built = buildMemoryApp();
  app = built.app;
  initDb = built.initDb;
}

let initError = null;

module.exports = async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }
    return app(req, res);
  } catch (err) {
    console.error('Handler error:', err && err.stack ? err.stack : err);
    initError = err && err.message ? err.message : String(err);
    // If DB init failed, fall back to in-memory
    if (!dbInitialized) {
      console.warn('DB init failed, switching to in-memory fallback:', initError);
      const built = buildMemoryApp();
      app = built.app;
      initDb = built.initDb;
      dbInitialized = true;
      return app(req, res);
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal server error' });
  }
};
