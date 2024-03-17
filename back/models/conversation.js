const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);