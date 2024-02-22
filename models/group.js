import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    users: {
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