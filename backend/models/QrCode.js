const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Session = require('./Session');

const QRCode = sequelize.define('QRCode', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

QRCode.belongsTo(Session, { foreignKey: { allowNull: false } });

module.exports = QRCode;
