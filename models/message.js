const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    modified: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Message', messageSchema);