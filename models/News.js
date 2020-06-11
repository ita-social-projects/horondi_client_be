const mongoose = require('mongoose');

const Language = require('./Language').schema;
const PrimaryImage = require('./PrimaryImage').schema;

const NewsSchema = new mongoose.Schema({
  title: [Language],
  text: [Language],
  images: [PrimaryImage],
  video: String,
  author: [
    {
      name: String,
      avatar: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', NewsSchema);
