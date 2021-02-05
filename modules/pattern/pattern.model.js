const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const patternSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  images: ImageSet,
  constructorImg: String,
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Pattern', patternSchema);
