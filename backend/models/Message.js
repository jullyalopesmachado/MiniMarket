const mongoose = require('mongoose');
const bcrypt = require('bycriptjs');

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    companyId: { type: String, required: true },
    isRead: { type: Boolean, default: false }
    },
    { collection: 'Messages' });

messageSchema.index({ senderId: 1, receiverId: 1, message: 1, companyId: 1 });


module.exports = mongoose.model('Message', messageSchema );
