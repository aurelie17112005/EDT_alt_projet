const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Session = sequelize.define('Session', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Association: une session appartient à un enseignant (User)
Session.belongsTo(User, { as: 'teacher', foreignKey: { allowNull: false } });

module.exports = Session;
