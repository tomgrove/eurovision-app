const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Performer = require('./Performer');

const Score = sequelize.define('Score', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  performerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Performer,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 12,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'performer_id'],
      unique: true,
    },
  ],
});

Score.belongsTo(User, { foreignKey: 'userId' });
Score.belongsTo(Performer, { foreignKey: 'performerId' });
User.hasMany(Score, { foreignKey: 'userId' });
Performer.hasMany(Score, { foreignKey: 'performerId' });

module.exports = { sequelize, User, Performer, Score };
