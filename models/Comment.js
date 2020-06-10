const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    date: {
        type: Date,
        default: Date.now
    },
    username: String
});

module.exports = mongoose.model('Comment', commentSchema)
