const Message = require('../models/Message');
const Login = require('../models/User');
const Business = require('../models/Business');
const { Types } = require("mongoose"); // Import ObjectId from Mongoose


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

    // Get sender's name
    const senderUser = await Login.findById(senderId).select("name");
    const senderName = senderUser?.name || "Unknown";

    res.status(201).json({
      success: true,
      message: {
        ...newMessage._doc,
        senderName
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
}


  async getMessagesForUser(req, res) {
    const { userId, businessId } = req.params;

    console.log("Request body:", req.params);

    if (!userId || !businessId) {
      return res.status(400).json({ success: false, message: "Missing fields." });
    }


    try {
      const messages = await Message.find({
        $or: [{ senderId: businessId }, { receiverId: businessId }],
      }).sort({ timestamp: +1 });

      const businessIds = Array.from(new Set(messages.flatMap(msg => [msg.senderId, msg.receiverId])));
     
     console.log("User IDs:", businessIds);
      const users = await Login.find({ _id: { $in: businessIds } }, { _id: 1, name: 1 });
      const userMap = {};
      users.forEach(user => userMap[user._id.toString()] = user.name);


      console.log("User Map:", userMap);
      // Fetch all businesses involved in the messages
const businesses = await Business.find({ _id: { $in: businessIds } }, { _id: 1, name: 1 });
      console.log("Businesses:", businesses);

// Create a map of business IDs to their names
const businessMap = {};
businesses.forEach(business => {
  businessMap[business._id.toString()] = business.name;
  console.log("Business Map:", businessMap);
});
      const groupedMessages = {};
    messages.forEach(msg => {
      console.log("Message:", msg);
      console.log("Sender ID:", msg.senderId);
      console.log("Receiver ID:", msg.receiverId);
      console.log("User ID:", userId);
      console.log("fromMe:", msg.senderId === userId);
    
      

      const myUser = userId;
      const otherUser = msg.receiverId === businessId ? msg.senderId : msg.receiverId;

      console.log("My User ID:", myUser);
      console.log("Other User ID:", otherUser);

      const otherUserId = msg.senderId.equals(businessId) ? msg.receiverId : msg.senderId;
      const otherUserName = businessMap[otherUserId] || "Unknown";

      console.log("Other User ID:", otherUserId);
      console.log("Other User Name:", otherUserName);

      const from = msg.senderId.equals(businessId);
      

        if (!groupedMessages[otherUserId]) {
          groupedMessages[otherUserId] = {
            name: otherUserName,
            messages: [],
          };
        }
  
        
  
        groupedMessages[otherUserId].messages.push({
          fromMe: from,
          text: msg.message,
          timestamp: new Date(msg.timestamp).toLocaleString(),
        });

      

      console.log("Other User ID:", otherUserId);
      console.log("Other User Name:", otherUserName);

     
      
      console.log("Grouped messages:", groupedMessages);
    });

      // Sort messages within each chat in ascending order (already sorted by query)
      Object.values(groupedMessages).forEach(chat => {
        chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
  
      console.log("Grouped Messages after sorting:", groupedMessages);

      // Sort chats by the most recent message in descending order
      const sortedGroupedMessages = Object.entries(groupedMessages)
        .sort(([, chatA], [, chatB]) => {
          const lastMessageA = chatA.messages[chatA.messages.length - 1];
          const lastMessageB = chatB.messages[chatB.messages.length - 1];
          return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
        })
        .reduce((acc, [businessId, chat]) => {
          acc[businessId] = chat;
          return acc;
        }, {});
  
      console.log("Sorted Grouped Messages:", sortedGroupedMessages);
  

    
    // Respond with the grouped messages
    res.status(200).json({ success: true, sortedGroupedMessages });
      
    } catch (error) {
      console.error("Error fetching user messages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch messages." });
    }
  }

  async getBusinessMessages(req, res) {
    const { businessId, companyId } = req.params;

    console.log("Request body:", req.params);

    if (!businessId || !companyId) {
      return res.status(400).json({ success: false, message: "Missing fields." });
    }


    try {
      const messages = await Message.find({
        $or: [{ senderId: businessId, receiverId: companyId },
           { senderId: companyId, receiverId: businessId }],
      }).sort({ timestamp: +1 });

      const businessIds = Array.from(new Set(messages.flatMap(msg => [msg.senderId, msg.receiverId])));
     
     console.log("User IDs:", businessIds);
      const users = await Login.find({ _id: { $in: businessIds } }, { _id: 1, name: 1 });
      const userMap = {};
      users.forEach(user => userMap[user._id.toString()] = user.name);


      console.log("User Map:", userMap);
      // Fetch all businesses involved in the messages
const businesses = await Business.find({ _id: { $in: businessIds } }, { _id: 1, name: 1 });
      console.log("Businesses:", businesses);

// Create a map of business IDs to their names
const businessMap = {};
businesses.forEach(business => {
  businessMap[business._id.toString()] = business.name;
  console.log("Business Map:", businessMap);
});
      const groupedMessages = {};
    messages.forEach(msg => {
      console.log("Message:", msg);
      console.log("Sender ID:", msg.senderId);
      console.log("Receiver ID:", msg.receiverId);
      console.log("User ID:", userId);
      console.log("fromMe:", msg.senderId === userId);
    
      

      const myUser = userId;
      const otherUser = msg.receiverId === businessId ? msg.senderId : msg.receiverId;

      console.log("My User ID:", myUser);
      console.log("Other User ID:", otherUser);

      const otherUserId = msg.senderId.equals(businessId) ? msg.receiverId : msg.senderId;
      const otherUserName = businessMap[otherUserId] || "Unknown";

      console.log("Other User ID:", otherUserId);
      console.log("Other User Name:", otherUserName);

      const from = msg.senderId.equals(businessId);
      

        if (!groupedMessages[otherUserId]) {
          groupedMessages[otherUserId] = {
            name: otherUserName,
            messages: [],
          };
        }
  
        
  
        groupedMessages[otherUserId].messages.push({
          fromMe: from,
          text: msg.message,
          timestamp: new Date(msg.timestamp).toLocaleString(),
        });

      

      console.log("Other User ID:", otherUserId);
      console.log("Other User Name:", otherUserName);

     
      
      console.log("Grouped messages:", groupedMessages);
    });

      // Sort messages within each chat in ascending order (already sorted by query)
      Object.values(groupedMessages).forEach(chat => {
        chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
  
      console.log("Grouped Messages after sorting:", groupedMessages);

      // Sort chats by the most recent message in descending order
      const sortedGroupedMessages = Object.entries(groupedMessages)
        .sort(([, chatA], [, chatB]) => {
          const lastMessageA = chatA.messages[chatA.messages.length - 1];
          const lastMessageB = chatB.messages[chatB.messages.length - 1];
          return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
        })
        .reduce((acc, [businessId, chat]) => {
          acc[businessId] = chat;
          return acc;
        }, {});
  
      console.log("Sorted Grouped Messages:", sortedGroupedMessages);
  

    
    // Respond with the grouped messages
    res.status(200).json({ success: true, sortedGroupedMessages });
      
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
