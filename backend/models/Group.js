const { Model, DataTypes } = require('sequelize');

class Group extends Model {
    static associate(models) {
        this.hasMany(models.User, { foreignKey: 'groupId', as: 'students' });
        this.hasMany(models.Session, { foreignKey: 'groupId', as: 'sessions' });
    }
}

module.exports = (sequelize) => {
    Group.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Group',
        tableName: 'groups',
        freezeTableName: true,
        timestamps: false
    });

    return Group;
};
