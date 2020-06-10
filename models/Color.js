const mongoose = require('mongoose');
const Language = require('./Language').schema;

const ColorSchema = new mongoose.Schema({
    code: Number,
    name: [Language],
    image: String,
    available: Boolean
});

module.exports = mongoose.model('Color', ColorSchema)