const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);