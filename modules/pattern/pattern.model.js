const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../../models/ImageSet').schema;

const patternSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  images: ImageSet,
  material: String,
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Pattern', patternSchema);
