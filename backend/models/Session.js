const { Model, DataTypes } = require('sequelize');

class Session extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'teacher', foreignKey: 'teacherId', targetKey: 'ldapId' });
    this.hasMany(models.Attendance, { foreignKey: 'sessionId', as: 'attendances' });
    this.hasMany(models.QrCode, { foreignKey: 'sessionId', as: 'qrcodes' });
    this.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
  }
}

module.exports = (sequelize) => {
  Session.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
    ,groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',  // <--- ici en minuscules
        key: 'ldapId'
      }
    }
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    freezeTableName: true,
    timestamps: true
  });

  return Session;
};
