const express = require('express');
const authRoutes = require('./auth');
const chatRoutes = require('./chats');
const groupRoutes = require('./groups');
const uploadRoutes = require('./uploads');
const userRoutes = require('./users');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chats', chatRoutes);
router.use('/groups', groupRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);

module.exports = router;