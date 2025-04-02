class MessageController {
    async sendMessage(req, res) {
        const { senderId, recipientId, messageContent } = req.body;

        // Logic to save the message to the database
        try {
            // Message details
            const message = await Message.create({
                senderId,
                recipientId,
                content: messageContent,
                timestamp: new Date(),
            });

            res.status(201).json({ success: true, message });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ success: false, message: "Failed to send message." });
        }
    }

    async getMessages(req, res) {
        const { userId1, userId2 } = req.params;

        // Logic to retrieve messages between two users
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: userId1, recipientId: userId2 },
                    { senderId: userId2, recipientId: userId1 },
                ],
            }).sort({ timestamp: 1 }); // Sort messages by timestamp

            res.status(200).json({ success: true, messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ success: false, message: "Failed to fetch messages." });
        }
    }

    async getMessageHistory(req, res) {
        const { companyId } = req.params;

        // Logic to retrieve message history for a specific company
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