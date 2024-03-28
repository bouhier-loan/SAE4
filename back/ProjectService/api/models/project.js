const mongoose = require('mongoose');
const Task = require('./task');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    conversation: {
        type: String,
        required: true,
    },
    participants: {
        type: [String],
        required: true,
    },
    tasks: {
        type: [Task.schema],
        required: true,
    },
});

module.exports = mongoose.model('Project', ProjectSchema);