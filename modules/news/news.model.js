const mongoose = require('mongoose');
const PrimaryImage = require('../../models/PrimaryImage').schema;
const ImageSet = require('../common/ImageSet').schema;

const NewsSchema = new mongoose.Schema({
  lang: String,
  title: String,
  text: String,
  images: PrimaryImage,
  author: {
    name: String,
    image: ImageSet,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  show: Boolean
});

module.exports = mongoose.model('News', NewsSchema);
