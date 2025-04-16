const Message = require('../models/Message');

class MessageController {
  async sendMessage(req, res) {
    const { senderId, receiverId, message, companyId } = req.body;

    if (!senderId || !receiverId || !message || !companyId) {
      return res.status(400).json({ success: false, message: "Missing fields." });
    }

    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
        companyId,
        timestamp: new Date(),
      });

      res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ success: false, message: "Failed to send message." });
    }
  }

  async getMessageHistory(req, res) {
    const { companyId } = req.params;

    try {
      const messages = await Message.find({ companyId }).sort({ timestamp: 1 });
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching message history:", error);
      res.status(500).json({ success: false, message: "Failed to fetch message history." });
    }
  }

  async getMessagesForUser(req, res) {
    const { userId } = req.params;

    try {
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).sort({ timestamp: 1 });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching user messages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch messages." });
    }
  }
}

module.exports = new MessageController();
