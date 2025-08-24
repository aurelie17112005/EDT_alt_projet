const { Model, DataTypes } = require('sequelize');

class QrCode extends Model {
  static associate(models) {
    this.belongsTo(models.Session, { foreignKey: 'sessionId', as: 'session' });
  }
}

module.exports = (sequelize) => {
  QrCode.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'QrCode',
    tableName: 'qrcodes',
    freezeTableName: true,
    timestamps: true
  });

  return QrCode;
};
