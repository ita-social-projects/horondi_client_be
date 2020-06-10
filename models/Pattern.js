const mongoose = require('mongoose');
const Language = require('./Language').schema;
const SmallImage = require('./SmallImage').schema;

const patternSchema = new mongoose.Schema({
  name: [Language],
  composition: String,
  description: [Language],
  images: SmallImage,
  material: String,
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Pattern', patternSchema);
