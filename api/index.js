/*
  Serverless API entrypoint for Vercel.
  - Tries to load the real Express app from server/*. If that fails (native module missing),
    falls back to a simple in-memory Express implementation so the frontend can function
    in production without Sequelize/sqlite native dependencies.
  - Set USE_MEMORY_DB=true to force the in-memory mode.
*/

let app;
let initDb = async () => {};
let moduleLoadError = null;

const useMemory = process.env.USE_MEMORY_DB === 'true';

// Builder for the in-memory fallback app (callable on-demand)
function buildMemoryApp() {
  const express = require('express');
  const cors = require('cors');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  require('dotenv').config();

  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

  const memoryApp = express();
  memoryApp.use(cors());
  memoryApp.use(express.json());

  // In-memory stores
  let nextUserId = 1;
  const users = [];
  const performers = [
    { id: 1, country: 'Albania', artistName: 'Alis', songTitle: 'Nân', countryCode: 'AL', semifinal: 2 },
    { id: 2, country: 'Armenia', artistName: 'Simon', songTitle: 'TBA', countryCode: 'AM', semifinal: 2 },
    { id: 3, country: 'Australia', artistName: 'Delta Goodrem', songTitle: 'Eclipse', countryCode: 'AU', semifinal: 2 },
    { id: 4, country: 'Austria', artistName: 'Cosmó', songTitle: 'Tanzschein', countryCode: 'AT', semifinal: null },
    { id: 5, country: 'Azerbaijan', artistName: 'JIVA', songTitle: 'Just Go', countryCode: 'AZ', semifinal: 2 },
    { id: 6, country: 'Belgium', artistName: 'ESSYLA', songTitle: 'Dancing on the Ice', countryCode: 'BE', semifinal: 1 },
    { id: 7, country: 'Bulgaria', artistName: 'DARA', songTitle: 'Bangaranga', countryCode: 'BG', semifinal: 2 },
    { id: 8, country: 'Croatia', artistName: 'LELEK', songTitle: 'Andromeda', countryCode: 'HR', semifinal: 1 },
    { id: 9, country: 'Cyprus', artistName: 'Antigoni', songTitle: 'JALLA', countryCode: 'CY', semifinal: 2 },
    { id: 10, country: 'Czechia', artistName: 'Daniel Zizka', songTitle: 'CROSSROADS', countryCode: 'CZ', semifinal: 2 },
    { id: 11, country: 'Denmark', artistName: 'Søren Torpegaard Lund', songTitle: 'Før Vi Går Hjem', countryCode: 'DK', semifinal: 2 },
    { id: 12, country: 'Estonia', artistName: 'Vanilla Ninja', songTitle: 'Too Epic To Be True', countryCode: 'EE', semifinal: 1 },
    { id: 13, country: 'Finland', artistName: 'Linda Lampenius x Pete Parkkonen', songTitle: 'Liekinheitin', countryCode: 'FI', semifinal: 1 },
    { id: 14, country: 'France', artistName: 'Monroe', songTitle: 'Regarde !', countryCode: 'FR', semifinal: null },
    { id: 15, country: 'Georgia', artistName: 'Bzikebi', songTitle: 'On Replay', countryCode: 'GE', semifinal: 1 },
    { id: 16, country: 'Germany', artistName: 'Sarah Engels', songTitle: 'Fire', countryCode: 'DE', semifinal: null },
    { id: 17, country: 'Greece', artistName: 'Akylas', songTitle: 'Ferto', countryCode: 'GR', semifinal: 1 },
    { id: 18, country: 'Israel', artistName: 'Noam Bettan', songTitle: 'Michelle', countryCode: 'IL', semifinal: 1 },
    { id: 19, country: 'Italy', artistName: 'Sal Da Vinci', songTitle: 'Per Sempre Sì', countryCode: 'IT', semifinal: null },
    { id: 20, country: 'Latvia', artistName: 'Atvara', songTitle: 'Ēnā', countryCode: 'LV', semifinal: 2 },
    { id: 21, country: 'Lithuania', artistName: 'Lion Ceccah', songTitle: 'Sólo Quiero Más', countryCode: 'LT', semifinal: 1 },
    { id: 22, country: 'Luxembourg', artistName: 'Eva Marija', songTitle: 'Mother Nature', countryCode: 'LU', semifinal: 2 },
    { id: 23, country: 'Malta', artistName: 'AIDAN', songTitle: 'Bella', countryCode: 'MT', semifinal: 2 },
    { id: 24, country: 'Moldova', artistName: 'Satoshi', songTitle: 'Viva, Moldova!', countryCode: 'MD', semifinal: 1 },
    { id: 25, country: 'Montenegro', artistName: 'Tamara Živković', songTitle: 'Nova Zora', countryCode: 'ME', semifinal: 1 },
    { id: 26, country: 'Norway', artistName: 'JONAS LOVV', songTitle: 'YA YA YA', countryCode: 'NO', semifinal: 2 },
    { id: 27, country: 'Poland', artistName: 'Alicja', songTitle: 'Pray', countryCode: 'PL', semifinal: 1 },
    { id: 28, country: 'Portugal', artistName: 'Bandidos do Cante', songTitle: 'Rosa', countryCode: 'PT', semifinal: 1 },
    { id: 29, country: 'Romania', artistName: 'Alexandra Căpitănescu', songTitle: 'Choke Me', countryCode: 'RO', semifinal: 2 },
    { id: 30, country: 'San Marino', artistName: 'Senhit', songTitle: 'Superstar', countryCode: 'SM', semifinal: 1 },
    { id: 31, country: 'Serbia', artistName: 'Lavina', songTitle: 'Kraj Mene', countryCode: 'RS', semifinal: 1 },
    { id: 32, country: 'Sweden', artistName: 'Felicia', songTitle: 'My System', countryCode: 'SE', semifinal: 1 },
    { id: 33, country: 'Switzerland', artistName: 'Veronica Fusaro', songTitle: 'Alice', countryCode: 'CH', semifinal: 2 },
    { id: 34, country: 'Ukraine', artistName: 'Leléka', songTitle: 'Ridnym', countryCode: 'UA', semifinal: 2 },
    { id: 35, country: 'United Kingdom', artistName: 'LOOK MUM NO COMPUTER', songTitle: 'Eins, Zwei, Drei', countryCode: 'GB', semifinal: null },
  ];

  let nextScoreId = 1;
  const scores = []; // { id, userId, performerId, score, comment }

  const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  // Routes
  memoryApp.get('/api/health', (req, res) => res.json({ status: 'Server (in-memory) is running' }));

  memoryApp.post('/api/auth/signup', async (req, res) => {
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

  memoryApp.post('/api/auth/login', async (req, res) => {
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

  memoryApp.get('/api/performers', (req, res) => {
    try {
      const sorted = [...performers].sort((a,b) => a.country.localeCompare(b.country));
      res.json(sorted);
    } catch (err) {
      console.error('In-memory performers error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  memoryApp.get('/api/performers/leaderboard', (req, res) => {
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

  memoryApp.get('/api/performers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const performer = performers.find(p => p.id === id);
      if (!performer) return res.status(404).json({ error: 'Performer not found' });
      const performerScores = scores.filter(s => s.performerId === id).map(s => {
        const user = users.find(u => u.id === s.userId) || {};
        return { id: s.id, score: s.score, comment: s.comment, userId: s.userId, User: { id: user.id, displayName: user.displayName } };
      });
      const result = { ...performer, Scores: performerScores };
      res.json(result);
    } catch (err) {
      console.error('In-memory performer by id error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  memoryApp.get('/api/performers/:id/average', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const performerScores = scores.filter(s => s.performerId === id).map(s => s.score);
      if (performerScores.length === 0) return res.json({ averageScore: 0, totalRatings: 0 });
      const sum = performerScores.reduce((a,b) => a + b, 0);
      const avg = sum / performerScores.length;
      res.json({ averageScore: avg.toFixed(2), totalRatings: performerScores.length });
    } catch (err) {
      console.error('In-memory performer average error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  memoryApp.post('/api/scores', authenticate, (req, res) => {
    try {
      const { performerId, score, comment } = req.body || {};
      const pId = parseInt(performerId, 10);
      if (!pId || score === undefined || score === null) return res.status(400).json({ error: 'Missing required fields' });
      if (score < 0 || score > 12) return res.status(400).json({ error: 'Score must be between 0 and 12' });
      const performer = performers.find(p => p.id === pId);
      if (!performer) return res.status(404).json({ error: 'Performer not found' });
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

  memoryApp.get('/api/scores/user/scores', authenticate, (req, res) => {
    try {
      const userScores = scores.filter(s => s.userId === req.userId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      res.json(userScores);
    } catch (err) {
      console.error('In-memory user scores error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  memoryApp.get('/api/scores/compare/:userId', authenticate, (req, res) => {
    try {
      const otherId = parseInt(req.params.userId, 10);
      const currentUserScores = scores.filter(s => s.userId === req.userId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      const otherUserScores = scores.filter(s => s.userId === otherId).map(s => ({ ...s, Performer: performers.find(p => p.id === s.performerId) }));
      const otherUser = users.find(u => u.id === otherId) || null;
      res.json({ currentUser: { id: req.userId, scores: currentUserScores }, otherUser: otherUser ? { id: otherUser.id, displayName: otherUser.displayName, username: otherUser.username, scores: otherUserScores } : null });
    } catch (err) {
      console.error('In-memory compare error:', err);
      res.status(500).json({ error: 'A server error has occurred' });
    }
  });

  // List users who have submitted scores (excluding current user)
  memoryApp.get('/api/scores/users', authenticate, (req, res) => {
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

  // attach to outer scope
  app = memoryApp;
  initDb = async () => { /* no-op for in-memory */ };
}

// Attempt to load real server modules first
try {
  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();

  try {
    const { initializeDatabase } = require('../server/src/seeds');
    const authRoutes = require('../server/src/routes/auth');
    const performersRoutes = require('../server/src/routes/performers');
    const scoresRoutes = require('../server/src/routes/scores');

    // only mount the real app if in-memory wasn't forced by env
    if (!useMemory && !moduleLoadError) {
      const realApp = express();
      realApp.use(cors());
      realApp.use(express.json());

      let dbInitialized = false;
      initDb = async () => {
        if (!dbInitialized) {
          await initializeDatabase();
          dbInitialized = true;
        }
      };

      realApp.get('/api/health', (req, res) => res.json({ status: 'Server is running' }));

      realApp.use('/api/auth', authRoutes);
      realApp.use('/api/performers', performersRoutes);
      realApp.use('/api/scores', scoresRoutes);

      realApp.use((err, req, res, next) => {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      });

      // attach if everything above worked
      app = realApp;
    }
  } catch (e) {
    console.error('Failed to load server modules, will fall back to in-memory DB. Error:', e && e.stack ? e.stack : e);
    moduleLoadError = e;
    // build in-memory if not already done
    if (!app) buildMemoryApp();
  }
} catch (e) {
  console.error('Core modules missing in runtime:', e && e.stack ? e.stack : e);
  moduleLoadError = e;
  if (!app) buildMemoryApp();
}

module.exports = async (req, res) => {
  if (!app) {
    console.error('No app available. Module load error:', moduleLoadError);
    res.status(500).json({ error: moduleLoadError && moduleLoadError.message ? moduleLoadError.message : 'No app available' });
    return;
  }

  try {
    await initDb();
    return app(req, res);
  } catch (err) {
    console.error('Top-level handler error during initDb:', err && err.stack ? err.stack : err);
    const msg = err && err.message ? err.message : String(err);
    // If initialization failed due to sqlite/native issues, switch to in-memory fallback
    if (/sqlite3|Cannot find module 'sqlite3'|no such file/i.test(msg) || useMemory || moduleLoadError) {
      console.warn('Init failed with DB/native error; switching to in-memory fallback:', msg);
      try {
        buildMemoryApp();
        await initDb();
        return app(req, res);
      } catch (fallbackErr) {
        console.error('Fallback init failed:', fallbackErr && fallbackErr.stack ? fallbackErr.stack : fallbackErr);
        res.status(500).json({ error: fallbackErr && fallbackErr.message ? fallbackErr.message : String(fallbackErr) });
        return;
      }
    }

    try {
      res.status(500).json({ error: msg });
    } catch (e) {
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }
};
