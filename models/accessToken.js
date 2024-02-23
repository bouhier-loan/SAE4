const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    userId : {
        type: Number,
        required: true
    },
    token : {
        type: String,
        required: true
    },
    expires : {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);