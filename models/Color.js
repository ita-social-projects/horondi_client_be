const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
    code: Number,
    image: String,
    available: Boolean
});

module.exports = mongoose.model('Color', ColorSchema)