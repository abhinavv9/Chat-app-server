const { File, Message, Chat, User } = require('../models');
const path = require('path');

class FileService {
    async uploadFile(file, userId) {
        // File is already saved by multer middleware
        const { originalname, mimetype, filename } = file;
        
        // Create URL for local file access (assuming Express serves /files route)
        const fileUrl = `/files/${filename}`;

        const newFile = await File.create({
            url: fileUrl,
            type: mimetype,
            senderId: userId,
            originalName: originalname
        });

        return newFile;
    }

    async shareFileInChat(file, userId, chatId, content = null) {
        // Upload file and create file record
        const fileRecord = await this.uploadFile(file, userId);
        
        // Create message with file attachment
        const messageType = content ? 'text_with_file' : 'file';
        
        const message = await Message.create({
            content,
            senderId: userId,
            chatId,
            fileId: fileRecord.id,
            messageType
        });
        
        // Return combined data for socket emission
        return {
            message,
            file: {
                id: fileRecord.id,
                url: fileRecord.url,
                type: fileRecord.type,
                originalName: fileRecord.originalName
            }
        };
    }

    async getFileMetadata(fileId) {
        const file = await File.findByPk(fileId);
        return file;
    }

    async notifyFileShared(io, result, senderId, chatId, senderName) {
        try {
            // Get all chat participants
            const chat = await Chat.findByPk(chatId, {
                include: [{
                    model: User,
                    attributes: ['id', 'username']
                }]
            });
            
            if (!chat) {
                throw new Error('Chat not found');
            }
            
            // Send notification to all users in this chat except sender
            chat.Users.forEach(user => {
                if (user.id !== senderId) {
                    console.log(`Emitting file_shared to user:${user.id}`);
                    
                    // Emit to this user's room
                    io.to(`user:${user.id}`).emit('receive_file', {
                        message: result.message,
                        file: result.file,
                        chatId: chatId,
                        senderId: senderId,
                        senderName: senderName,
                        timestamp: new Date()
                    });
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error notifying file shared:', error);
            return false;
        }
    }
}

module.exports = new FileService();