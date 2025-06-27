const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Session = require('./Session');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validatedByPeer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

Attendance.belongsTo(Session, { foreignKey: { allowNull: false } });
Attendance.belongsTo(User, { as: 'student', foreignKey: { allowNull: false } });

module.exports = Attendance;
