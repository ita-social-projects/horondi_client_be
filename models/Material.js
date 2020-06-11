const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('./ImageSet').schema;
const Color = require('./Color').schema;

const materialSchema = new mongoose.Schema({
    name: [Language],
    composition: String,
    description: [Language],
    images: ImageSet,
    colors: [Color],
    available: Boolean,
    additionalPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Material', materialSchema)