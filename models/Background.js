const mongoose = require('mongoose');
const ImageSet = require('../modules/common/ImageSet').schema;

const BackgroundSchema = new mongoose.Schema({
  usedIn: String,
  images: ImageSet,
  active: Boolean,
});

module.exports = mongoose.model('Background', BackgroundSchema);
