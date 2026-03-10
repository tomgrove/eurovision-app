const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('../server/src/seeds');
const authRoutes = require('../server/src/routes/auth');
const performersRoutes = require('../server/src/routes/performers');
const scoresRoutes = require('../server/src/routes/scores');

const app = express();

app.use(cors());
app.use(express.json());

let dbInitialized = false;

// Initialize database once
const initDb = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes without /api prefix (Vercel rewrite handles that)
app.use('/auth', authRoutes);
app.use('/performers', performersRoutes);
app.use('/scores', scoresRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Vercel serverless handler
module.exports = async (req, res) => {
  await initDb();
  return app(req, res);
};
