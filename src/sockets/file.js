const FileService = require('../services/FileService');

module.exports = function(io, socket) {
    // Join chat rooms that the user is part of
    socket.on('join_chat', (chatId) => {
        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.id} joined chat room: chat:${chatId}`);
    });

    // Handle file sharing in chat
    socket.on('share_file', async (data) => {
        try {
            const { fileId, chatId, content } = data;
            
            // Check if user is authenticated
            if (!socket.user) {
                return socket.emit('error', { message: 'Authentication required' });
            }
            
            const userId = socket.user.id;
            
            // Get file metadata
            const file = await FileService.getFileMetadata(fileId);
            
            if (!file) {
                return socket.emit('error', { message: 'File not found' });
            }
            
            // Emit to all users in the chat
            io.to(`chat:${chatId}`).emit('file_shared', {
                senderId: userId,
                senderName: socket.user.username,
                chatId,
                file: {
                    id: file.id,
                    url: file.url,
                    type: file.type,
                    originalName: file.originalName
                },
                content,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error sharing file:', error);
            socket.emit('error', { message: 'Failed to share file' });
        }
    });
};