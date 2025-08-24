const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static associate(models) {
    this.hasMany(models.Session, { foreignKey: 'teacherId', as: 'sessions' });
    this.hasMany(models.Attendance, { foreignKey: 'studentId', sourceKey: 'ldapId', as: 'attendances' });
    this.hasMany(models.Attendance, { foreignKey: 'validatedBy', sourceKey: 'ldapId', as: 'validatedAttendances' });
    this.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
  }
}

module.exports = (sequelize) => {
  User.init({
    ldapId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'student'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
    timestamps: true
  });

  return User;
};
