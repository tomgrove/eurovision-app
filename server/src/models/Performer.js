const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Performer = sequelize.define('Performer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  semifinal: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Performer;
