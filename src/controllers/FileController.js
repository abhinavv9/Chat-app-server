const FileService = require('../services/FileService');

class FileController {
    async shareFileInChat(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            const userId = req.user.id;
            const { chatId } = req.params;
            const { content } = req.body;
            
            // Process file upload and create message
            const result = await FileService.shareFileInChat(req.file, userId, chatId, content);
            
            // Use service to handle notifications if io is available
            if (req.app.io) {
                await FileService.notifyFileShared(
                    req.app.io,
                    result,
                    userId,
                    chatId,
                    req.user.username
                );
            }
            
            res.status(201).json({
                success: true,
                message: 'File shared successfully',
                data: result
            });
        } catch (error) {
            console.error('File sharing error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to share file',
                error: error.message
            });
        }
    }
}

module.exports = new FileController();
