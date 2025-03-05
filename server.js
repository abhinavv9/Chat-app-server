const http = require('http');
const app = require('./src/app');
const initializeSockets = require('./src/sockets');
const sequelize = require('./src/config/database');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io with server
const io = initializeSockets(server);
app.io = io;

// Sync database and start server
const startServer = async () => {
  try {
    console.log('Database connecting...');
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();