const express = require('express');
const FileController = require('../controllers/FileController');
const upload = require('../middlewares/upload');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Route for uploading files
// router.post('/', 
//   authenticateJWT, // Add authentication
//   upload.single('file'), // Specify that we're uploading a single file with field name 'file'
//   FileController.uploadFile // Use uploadFile method
// );

// Route for sharing files in a chat - allowing any field name
router.post('/:chatId/share-file', 
  authenticateJWT,
  (req, res, next) => {
    // Debug log to see what fields are coming in
    console.log('Incoming form fields:', Object.keys(req.body));
    console.log('Files object:', req.files);
    next();
  },
  upload.any(), // Accept any field instead of specifying a name
  (req, res, next) => {
    // Check if we have any files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded. Make sure you\'re using the correct field name in your FormData.'
      });
    }
    // Attach the first file to req.file so the controller can use it
    req.file = req.files[0];
    next();
  },
  FileController.shareFileInChat
);

module.exports = router;