const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');



// Route to send a message
router.post('/:companyId/message', messageController.sendMessage);


// Route to get message history between users
router.get('/:companyId/messages', messageController.getMessages);

// Route to get message history for a specific company
router.get('/:companyId/message-history', messageController.getMessageHistory);

module.exports = router;