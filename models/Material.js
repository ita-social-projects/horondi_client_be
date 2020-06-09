const mongoose = require('mongoose');
const Language = require('./Language').schema;
const SmallImage = require('./SmallImage').schema;
const Color = require('./Color').schema;

const materialSchema = new mongoose.Schema({
    name: String,
    composition: String,
    description: [Language],
    images: SmallImage,
    colors: [Color],
    available: Boolean,
    additionalPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Material', materialSchema)