const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    date: {
        type: Date,
        default: Date.now
    },
    username: String,
    product: String,
    show: Boolean
});

module.exports = mongoose.model('Comment', commentSchema)
