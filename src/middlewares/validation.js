const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateMessage = [
    body('content').notEmpty().withMessage('Message content is required'),
    body('chatId').notEmpty().withMessage('Chat ID is required'),
];

const validateGroup = [
    body('name').notEmpty().withMessage('Group name is required'),
];

const validateFileUpload = [
    body('file').notEmpty().withMessage('File is required'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateMessage,
    validateGroup,
    validateFileUpload,
    validateRequest,
};