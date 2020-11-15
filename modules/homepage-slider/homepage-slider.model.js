const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: String,
  images: ImageSet,
  order: Number,
  show: Boolean,
});

module.exports = mongoose.model('HomePageSlide', HomePageSlideSchema);
