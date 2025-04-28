const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/user/:userId/business/:businessId', authMiddleware(["owner","admin"]), async (req, res) => {
  const { userId, businessId } = req.params;

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  return messageController.getMessagesForUser(req, res);
});

router.get('/business/:businessId/private/:companyId', authMiddleware(["owner","admin"]), async (req, res) => {
  const { businessId, companyId } = req.params;

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  return messageController.getBusinessMessages(req, res);
});

router.post('/:companyId/message', authMiddleware(["owner", "admin"]), messageController.sendMessage);

router.get('/:companyId/message-history', authMiddleware(["owner", "admin"]), messageController.getMessageHistory);

module.exports = router;
