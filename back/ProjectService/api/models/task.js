const mongoose = require('mongoose');

const PRIORITY_LOW = 'Low';
const PRIORITY_MEDIUM = 'Medium';
const PRIORITY_HIGH = 'High';

const TaskSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignees: {
        type: [String],
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: [
            PRIORITY_LOW,
            PRIORITY_MEDIUM,
            PRIORITY_HIGH,
        ],
        required: true,
    },
    done: {
        type: Boolean,
        required: true,
        default: false,
    },
});

module.exports = mongoose.model('Task', TaskSchema);
module.exports.PRIORITY_LOW = PRIORITY_LOW;
module.exports.PRIORITY_MEDIUM = PRIORITY_MEDIUM;
module.exports.PRIORITY_HIGH = PRIORITY_HIGH;