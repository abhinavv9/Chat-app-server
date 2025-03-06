const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if we have a connection string or individual parameters
if (process.env.DATABASE_URL) {
  // Use connection string if available
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Force IPv4 connections
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432
  });
} else {
  // Fall back to individual parameters if no connection string
  sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Try to provide more helpful error information
    if (error.original && error.original.code) {
      console.error('Error code:', error.original.code);
    }
    if (process.env.DATABASE_URL) {
      console.log('Using connection string (DATABASE_URL)');
    } else {
      console.log('Using individual connection parameters');
    }
  }
};

// Test connection on startup
testConnection();

module.exports = sequelize;