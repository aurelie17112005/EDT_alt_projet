const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Use DATABASE_URL if available (Render provides this), otherwise construct from individual vars
const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (databaseUrl) {
  // Use DATABASE_URL (preferred for Render deployment)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: isProduction ? {
        require: true,
        rejectUnauthorized: false // Required for Render
      } : false,
    },
  });
} else {
  // Fallback to individual environment variables (for local development)
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: false,
    },
  });
}

module.exports = sequelize;
