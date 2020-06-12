const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('./ImageSet').schema;

const ColorSchema = new mongoose.Schema({
    code: Number,
    name: [Language],
    images: ImageSet,
    available: Boolean
});

module.exports = mongoose.model('Color', ColorSchema)