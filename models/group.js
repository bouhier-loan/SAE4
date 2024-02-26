import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
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
    },
    name: {
        type: String,
        required: true
    }
})

export default mongoose.model('Group', groupSchema);