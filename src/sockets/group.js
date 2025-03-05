const GroupService = require("../services/GroupService");
const { User } = require("../models");

module.exports = function (io, socket) {
  // Create a new group
  socket.on("create_group", async (groupData) => {
    try {
      // Add the creator to the members list if not already included
      if (!groupData.members || !groupData.members.includes(socket.user.id)) {
        groupData.members = [...(groupData.members || []), socket.user.id];
      }

      const group = await GroupService.createGroup({
        ...groupData,
        creatorId: socket.user.id,
      });

      // Create a room for this group
      const groupRoom = `group:${group.id}`;

      // Join the creator to this group room
      socket.join(groupRoom);

      if (group.Users && Array.isArray(group.Users)) {
        group.Users.forEach((user) => {
          // This sends to all sockets associated with this user
          io.to(`user:${user.id}`).emit("group_created", group);
        });
      }
    } catch (error) {
      console.error("Error creating group:", error);
      socket.emit("error", { message: "Failed to create group" });
    }
  });

  // Join a group
  socket.on("join_group_room", (groupId) => {
    socket.join(`group:${groupId}`);
    console.log(`User ${socket.user.username} joined group: ${groupId}`);
  });

  // Add a user to a group
  socket.on("join_group", async (data) => {
    try {
      const { groupId, userId } = data;
      const group = await GroupService.addUserToGroup(groupId, userId);

      // Send to all clients in the room
      socket.to(`group:${groupId}`).emit("user_joined_group", {
        groupId,
        userId,
      });

      // Send to all the connected users who are in the group
      group.members.forEach((member) => {
        io.to(`user:${member.id}`).emit("user_joined_group", {
          groupId,
          userId,
        });
      });
    } catch (error) {
      console.error("Error adding user to group:", error);
      socket.emit("error", { message: "Failed to add user to group" });
    }
  });

  // Send a group message
  socket.on("group_message", async (messageData) => {
    try {
      const message = await GroupService.sendGroupMessage(
        messageData.groupId,
        messageData.content,
        socket.user.id,
      );

      // Send to all clients in the room EXCEPT sender
      socket.to(`group:${messageData.groupId}`).emit("receive_group_message", {
        ...message.toJSON(),
        senderName: socket.user.username,
      });
    } catch (error) {
      console.error("Error sending group message:", error);
      socket.emit("error", { message: "Failed to send group message" });
    }
  });
};
