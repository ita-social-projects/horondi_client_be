const mongoose = require('mongoose');
const Language = require('./Language').schema;
const FillerText = require('./FillerText').schema;

const FillerSchema = new mongoose.Schema({
    page: String,
    heading: [Language],
    regionOptions: [FillerText],
    buttons: [FillerText],
    placeholders: [FillerText],
    errors: [FillerText]
});

module.exports = mongoose.model('Filler', FillerSchema);
