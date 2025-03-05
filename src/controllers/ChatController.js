const ChatService = require('../services/ChatService');

class ChatController {
    // Get chat history
    async getChatHistory(req, res) {
        try {
            const { chatId } = req.params;
            const messages = await ChatService.getChatHistory(chatId);
            
            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Error fetching chat history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch chat history',
                error: error.message
            });
        }
    }

    async createChat(req, res) {
        try {
            const chat = await ChatService.createChat(req.body);
            
            res.status(201).json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create chat',
                error: error.message
            });
        }
    }
    
    // Send message
    async sendMessage(req, res) {
        try {
            const { content, chatId } = req.body;
            const senderId = req.user.id;
            const message = await ChatService.sendMessage({
                chatId,
                content,
                senderId
            });
            
            res.status(201).json({
                success: true,
                data: message
            });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message',
                error: error.message
            });
        }
    }
}

module.exports = new ChatController();