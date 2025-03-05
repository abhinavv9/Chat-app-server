const { Group, Message, User, Chat } = require("../models");

class GroupService {
  async createGroup(groupData) {
    try {
      // First create a chat for this group
      const chat = await Chat.create({
        name: groupData.name,
        type: "group",
        lastMessageAt: new Date(),
      });

      // Then create the group with the chat ID
      const group = await Group.create({
        name: groupData.name,
        description: groupData.description || null,
        avatar: groupData.avatar || null,
        creatorId: groupData.creatorId,
        chatId: chat.id,
      });

      // Make creator a member of the group
      await group.addUser(groupData.creatorId, {
        through: { role: "admin" },
      });

      // If members are specified, add them to the group
      if (Array.isArray(groupData.members) && groupData.members.length > 0) {
        // Filter out the creator ID if it's in the members array
        const otherMembers = groupData.members.filter(
          (id) => id !== groupData.creatorId
        );

        if (otherMembers.length > 0) {
          // Add other members with 'member' role
          await Promise.all(
            otherMembers.map((userId) =>
              group.addUser(userId, { through: { role: "member" } })
            )
          );
        }
      }

      // Also add all group members to the chat
      await chat.addUser(groupData.creatorId);
      if (Array.isArray(groupData.members) && groupData.members.length > 0) {
        await chat.addUsers(groupData.members);
      }

      // Return the group with its members and chat
      return Group.findByPk(group.id, {
        include: [
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
          {
            model: Chat,
            attributes: ["id", "name", "type"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "username", "email"],
          },
        ],
      });
    } catch (error) {
      throw new Error("Error creating group: " + error.message);
    }
  }

  async addUserToGroup(groupId, userId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw new Error("Group not found");
      }
      // Assuming there's a many-to-many relationship between users and groups
      await group.addUser(userId);

      // Include the users in the group
      group.members = await group.getUsers({
        attributes: ["id", "username", "email"],
      });
      return group;
    } catch (error) {
      throw new Error("Error adding user to group: " + error.message);
    }
  }

  async addUsersToGroup(groupId, userIds) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw new Error('Group not found');
      }
      
      // Add users to the group
      await Promise.all(userIds.map(userId => 
        group.addUser(userId, { through: { role: 'member' }})
      ));
      
      // Also add users to the associated chat
      const chat = await Chat.findByPk(group.chatId);
      await Promise.all(userIds.map(userId => chat.addUser(userId)));
      
      return Group.findByPk(groupId, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
            through: { attributes: [] }
          }
        ]
      });
    } catch (error) {
      throw new Error(`Error adding users to group: ${error.message}`);
    }
  }

  async getGroupMessages(groupId) {
    try {
      const group = await Group.findByPk(groupId, {
        include: [{ model: Message, as: "messages" }],
      });
      if (!group) {
        throw new Error("Group not found");
      }
      return group.messages;
    } catch (error) {
      throw new Error("Error fetching group messages: " + error.message);
    }
  }

  async sendGroupMessage(groupId, content, senderId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw new Error("Group not found");
      }
      const message = await Message.create({
        content,
        chatId: group.chatId,
        senderId,
        messageType: "text",
      });
      return message;
    } catch (error) {
      throw new Error("Error sending group message: " + error.message);
    }
  }

  async getGroups(id) {
    try {
      const groups = await Group.findAll({
        where: { creatorId: id },
        attributes: ["id", "name", "description", "avatar"],
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
            through: { attributes: [] } // This excludes the junction table fields
          },
          {
            model: Chat,
            attributes: ['id', 'name', 'type']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email']
          }
        ]
      });
      return groups;
    } catch (error) {
      throw new Error("Error fetching groups: " + error.message);
    }
  }

  async getGroupById(groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw new Error("Group not found");
      }
      return group;
    } catch (error) {
      throw new Error("Error fetching group: " + error.message);
    }
  }
}

module.exports = new GroupService();
