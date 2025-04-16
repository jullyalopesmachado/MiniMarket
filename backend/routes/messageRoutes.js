const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  return messageController.getMessagesForUser(req, res);
});

router.post('/:companyId/message', messageController.sendMessage);

router.get('/:companyId/message-history', messageController.getMessageHistory);

module.exports = router;
