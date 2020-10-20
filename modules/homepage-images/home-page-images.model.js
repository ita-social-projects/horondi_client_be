const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;

const HomePageImagesSchema = new mongoose.Schema({
  images: ImageSet,
});

module.exports = mongoose.model('LooksImages', HomePageImagesSchema);
