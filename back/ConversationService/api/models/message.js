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
        },
        senderId: {
            type: String,
            required: false
        },
        participantId: {
            type: String,
            required: false
        },
        old_name: {
            type: String,
            required: false
        },
        new_name: {
            type: String,
            required: false
        },
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