const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('Group', groupSchema);