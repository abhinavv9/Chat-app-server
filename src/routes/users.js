const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateJWT } = require('../middlewares/auth');

// Get all users (protected route)
router.get('/', authenticateJWT, UserController.getUsers);

// Get user by ID (protected route)
router.get('/:id', authenticateJWT, UserController.getUserById);

router.get('/un/:username', authenticateJWT, UserController.getUserByUsername);

module.exports = router;