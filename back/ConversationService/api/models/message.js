const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    content: {
        message : {
            type: String,
            required: true
        }
        // Attachments, etc.
    },
    conversationId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    modified: {
        type: Boolean,
        required: true,
        default: false
    },
    seenBy: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = mongoose.model('Message', messageSchema);