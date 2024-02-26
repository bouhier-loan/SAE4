const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    id: {
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
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);