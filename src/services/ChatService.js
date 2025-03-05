const { Chat, Message, User, File } = require('../models');

class ChatService {
  // Create a new chat
  async createChat(chatData) {
    try {
      // Create the chat first
      const chat = await Chat.create({
        name: chatData.name,
        type: chatData.type || 'one-to-one',
        lastMessageAt: new Date()
      });
      
      // If participants array is provided, associate them with the chat
      if (Array.isArray(chatData.participants) && chatData.participants.length > 0) {
        await chat.addUsers(chatData.participants);
      }
      
      // Return chat with its participants
      return this.getChatById(chat.id);
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }
  
  // Get chat by ID with participants
  async getChatById(chatId) {
    const chat = await Chat.findByPk(chatId, {
      include: [
        { 
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    return chat;
  }
  
  // Send a message in a chat
  // Now accepts object parameter to match controller usage
  async sendMessage({ chatId, content, senderId }) {
    // Check if chat exists
    const chat = await Chat.findByPk(chatId);
    
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    const message = await Message.create({
      content,
      chatId,
      senderId,
      messageType: 'text'
    });
    
    return message;
  }
  
  // Get chat history
  async getChatHistory(chatId) {
    const messages = await Message.findAll({
      where: { chatId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username']
        },
        {
            model: File,
            as: 'attachment',
            attributes: ['id', 'url', 'type', 'originalName']
        }
      ],
      order: [['createdAt', 'ASC']]
    });
    
    return messages;
  }

  // Add this method to your existing ChatService class
  async getChatParticipants(chatId) {
    try {
      const chat = await Chat.findByPk(chatId, {
        include: [{
          model: User,
          attributes: ['id']
        }]
      });
      
      if (!chat) {
        throw new Error('Chat not found');
      }
      
      return chat.Users;
    } catch (error) {
      console.error('Error getting chat participants:', error);
      throw new Error(`Failed to get chat participants: ${error.message}`);
    }
  }
}

module.exports = new ChatService();