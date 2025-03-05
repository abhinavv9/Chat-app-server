const express = require('express');
const ChatController = require('../controllers/ChatController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticateJWT, ChatController.createChat);

// Send a message
router.post('/send-message', authenticateJWT, ChatController.sendMessage);

// Fetch chat history
router.get('/:chatId', authenticateJWT, ChatController.getChatHistory);

module.exports = router;