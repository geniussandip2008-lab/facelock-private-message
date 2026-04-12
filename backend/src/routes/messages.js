const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const {
  createMessage,
  getUserMessages,
  getMessageByLink,
  incrementViewCount,
  saveReply,
  uploadFaceReference
} = require('../controllers/messagesController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Creator routes (protected)
router.post('/', authenticateToken, createMessage);
router.get('/', authenticateToken, getUserMessages);
router.post('/:link/view', getMessageByLink, incrementViewCount);
router.post('/:link/reply', saveReply);
router.post('/face-reference', authenticateToken, upload.single('image'), uploadFaceReference);

// Public recipient routes
router.get('/:link', getMessageByLink);

module.exports = router;