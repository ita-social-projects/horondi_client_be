const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const PrimaryImage = require('../../models/PrimaryImage').schema;
const ImageSet = require('../common/ImageSet').schema;

const NewsSchema = new mongoose.Schema({
  title: [Language],
  text: [Language],
  images: PrimaryImage,
  video: String,
  author: {
    name: {
      type: Array,
      default: [
        {
          lang: 'uk',
          value: 'Горонді',
        },
        {
          lang: 'en',
          value: 'Horondi',
        },
      ],
    },
    image: ImageSet,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', NewsSchema);
