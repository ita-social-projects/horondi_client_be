const mongoose = require('mongoose');
const Language = require('./Language').schema;
const Color = require('./Color').schema;

const materialSchema = new mongoose.Schema({
    name: [Language],
    description: [Language],
    colors: [Color],
    available: Boolean,
    additionalPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Material', materialSchema)