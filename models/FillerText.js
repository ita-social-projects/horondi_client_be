const mongoose = require('mongoose');
const Language = require('./Language').schema;

const FillerTextSchema = new mongoose.Schema({
    name: String,
    text: [Language]
});

module.exports = mongoose.model('FillerText', FillerTextSchema);
