const GroupService = require("../services/GroupService");

class GroupController {
  async createGroup(req, res) {
    try {
      const { name, members, description } = req.body;
      const creatorId = req.user.id;
      members.push(creatorId);
      const group = await GroupService.createGroup({
        name,
        members,
        description,
        creatorId,
      });
      res.status(201).json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addUserToGroup(req, res) {
    try {
      const { groupId, userIds } = req.body;
      
      if (!groupId || !userIds || !Array.isArray(userIds)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request body. Requires groupId and userIds array.'
        });
      }
      
      const result = await GroupService.addUsersToGroup(groupId, userIds);
      
      res.status(200).json({
        success: true,
        message: 'Users added successfully',
        data: result
      });
    } catch (error) {
      console.error('Error adding users to group:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add users to group',
        error: error.message
      });
    }
  }

  async getGroupMessages(req, res) {
    try {
      const { groupId } = req.params;
      const messages = await GroupService.getGroupMessages(groupId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGroups(req, res) {
    try {
      const groups = await GroupService.getGroups(req.user.id);
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGroupById(req, res) {
    try {
      const { groupId } = req.params;
      const group = await GroupService.getGroupById(groupId);
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async sendGroupMessage(req, res) {
    try {
      const { groupId, content } = req.body;
      const senderId = req.user.id;
      const message = await GroupService.sendGroupMessage(
        groupId,
        content,
        senderId
      );
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GroupController();
