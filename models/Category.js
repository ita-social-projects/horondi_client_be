const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('./ImageSet').schema;

const CategorySchema = new mongoose.Schema({
    categoryCode: String,
    name: [Language],
    images: ImageSet,
    available: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
