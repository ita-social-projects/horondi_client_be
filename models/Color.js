const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('../modules/common/ImageSet').schema;

const ColorSchema = new mongoose.Schema({
  code: Number,
  name: [Language],
  simpleName: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model('Color', ColorSchema);
