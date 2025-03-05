const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateRegister, validateLogin } = require('../middlewares/validation');

// Register a new user
router.post('/register', validateRegister, AuthController.register);

// Login user
router.post('/login', validateLogin, AuthController.login);

module.exports = router;