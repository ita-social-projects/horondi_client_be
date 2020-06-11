const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('./ImageSet').schema;

const patternSchema = new mongoose.Schema({
  name: [Language],
  composition: String,
  description: [Language],
  images: ImageSet,
  material: String,
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Pattern', patternSchema);
