const mongoose = require('mongoose');
const Language = require('./Language').schema;
const Color = require('./Color').schema;

const closureSchema = new mongoose.Schema({
    name: [Language],
    colors: [Color],
    available: Boolean,
    additionalPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Closure', closureSchema)