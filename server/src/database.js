const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use Postgres if DATABASE_URL is provided (recommended for production), otherwise use in-memory SQLite
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Fallback to in-memory SQLite for local development and simple deployments
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
}

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;
