const ChatService = require("../services/ChatService");

module.exports = function (io, socket) {
  // Join a chat room
  socket.on("join_chat", (chatId) => {
    console.log(`User ${socket.user.username} joined chat: ${chatId}`);
    socket.join(`chat:${chatId}`);
  });

  // Send a message
  socket.on("send_message", async (data) => {
    try {
      const { chatId, content } = data;
      const senderId = socket.user.id;

      const message = await ChatService.sendMessage({
        chatId,
        content,
        senderId,
      });

      // Send to all OTHER clients in the room
      socket.to(`chat:${chatId}`).emit("receive_message", {
        ...message.toJSON(),
        senderName: socket.user.username,
      });

      // For Single Tick
      socket.emit("message_sent", {
        messageId: message.id,
        timestamp: message.createdAt,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Socket event for typing indicator
  socket.on("typing", (data) => {
    const { chatId } = data;
    socket.to(`chat:${chatId}`).emit("user_typing", {
      userId: socket.user.id,
      username: socket.user.username,
    });
  });

  // Socket event for stopping typing
  socket.on("stop_typing", (data) => {
    const { chatId } = data;
    socket.to(`chat:${chatId}`).emit("user_stop_typing", {
      userId: socket.user.id,
    });
  });
};
