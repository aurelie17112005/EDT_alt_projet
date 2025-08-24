// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Instanciation de Sequelize avec les variables d'environnement
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    }
);

const db = {};

// Chargement dynamique des fichiers de modèles
fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize);
        db[model.name] = model;
    });

// Appel des associations définies dans chaque modèle
Object.keys(db).forEach(modelName => {
    if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

// Exports
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
