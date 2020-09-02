const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const ContactSchema = new mongoose.Schema({
  phoneNumber: Number,
  openHours: [Language],
  address: [Language],
  email: String,
  images: [
    {
      lang: String,
      value: ImageSet,
    },
  ],
  link: String,
});

module.exports = mongoose.model('Contact', ContactSchema);
