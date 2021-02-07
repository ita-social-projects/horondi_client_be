const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const IMAGE_NOT_PROVIDED = require('../../error-messages/constructor-basic-messages.js');

const NewsSchema = new mongoose.Schema({
  title: [Language],
  text: [Language],
  image: {
    type: String,
    required: [true, IMAGE_NOT_PROVIDED],
  },
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
    image: {
      type: String,
      required: [true, IMAGE_NOT_PROVIDED],
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  show: Boolean,
  languages: [String],
});

module.exports = mongoose.model('News', NewsSchema);
