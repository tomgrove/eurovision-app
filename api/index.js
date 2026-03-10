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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/performers', performersRoutes);
app.use('/api/scores', scoresRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Vercel serverless handler with top-level error handling
module.exports = async (req, res) => {
  try {
    await initDb();
    // Hand off to Express app
    return app(req, res);
  } catch (err) {
    // Log full error for debugging in Vercel logs
    console.error('Top-level handler error:', err && err.stack ? err.stack : err);
    // Return useful JSON for debugging (will be visible in curl but Vercel may still mask some)
    try {
      res.status(500).json({ error: err && err.message ? err.message : String(err) });
    } catch (e) {
      // If sending JSON fails, fallback to plain text
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }
};
