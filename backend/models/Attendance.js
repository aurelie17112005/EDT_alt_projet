// models/Attendance.js
const { Model, DataTypes } = require('sequelize');

class Attendance extends Model {
  static associate(models) {
    // Association avec la séance
    this.belongsTo(models.Session, { foreignKey: 'sessionId', as: 'session' });
    // Association vers l'étudiant
    this.belongsTo(models.User, { foreignKey: 'studentId', targetKey: 'ldapId', as: 'student' });
    // Association vers le validateur (pair)
    this.belongsTo(models.User, { foreignKey: 'validatedBy', targetKey: 'ldapId', as: 'validator' });
  }
}

module.exports = (sequelize) => {
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    mode: {
      type: DataTypes.STRING,
      defaultValue: 'QR'
    },
    validatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validatedByPeer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendances',
    freezeTableName: true,
    timestamps: true
  });

  return Attendance;
};
