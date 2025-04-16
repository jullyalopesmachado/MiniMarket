const Message = require('../models/Message');
const Login = require('../models/User');

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

  async getMessagesForUser(req, res) {
    const { userId } = req.params;

    try {
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).sort({ timestamp: -1 });

      const userIds = Array.from(new Set(messages.flatMap(msg => [msg.senderId, msg.receiverId])));
      const users = await Login.find({ _id: { $in: userIds } }, { _id: 1, name: 1 });
      const userMap = {};
      users.forEach(user => userMap[user._id.toString()] = user.name);

      const formattedMessages = messages.map(msg => ({
        ...msg._doc,
        senderName: userMap[msg.senderId] || "Unknown",
        receiverName: userMap[msg.receiverId] || "Unknown",
      }));

      res.status(200).json({ sentMessages: formattedMessages.filter(msg => msg.senderId === userId), receivedMessages: formattedMessages.filter(msg => msg.receiverId === userId) });
    } catch (error) {
      console.error("Error fetching user messages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch messages." });
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
}

module.exports = new MessageController();
