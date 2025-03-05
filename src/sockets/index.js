const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// Import socket handlers
const chatHandler = require("./chat");
const groupHandler = require("./group");
const fileHandler = require("./file");
const logger = require("../utils/logger");

const initializeSockets = (server) => {
  logger.info("Initializing sockets...");
  const io = new Server(server, {
    cors: {
      origin: "*", // Update with your frontend origin in production
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      logger.info("Authenticating socket...");
      const token = socket.handshake.headers.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify token using environment variable
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user to socket
      socket.user = user;

      // join to user room
      socket.join(`user:${user.id}`);

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `User ${socket.user.username} (ID: ${socket.user.id}) connected: ${socket.id}`
    );

    // Initialize socket handlers
    chatHandler(io, socket);
    groupHandler(io, socket);
    fileHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.username} disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSockets;
