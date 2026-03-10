const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./seeds');
const authRoutes = require('./routes/auth');
const performersRoutes = require('./routes/performers');
const scoresRoutes = require('./routes/scores');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/performers', performersRoutes);
app.use('/api/scores', scoresRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🎵 Eurovision Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
