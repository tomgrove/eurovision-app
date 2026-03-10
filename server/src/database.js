const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use in-memory SQLite for development (Sequelize handles this automatically)
// Sequelize automatically uses sqlite3 dialect with :memory: storage
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;
