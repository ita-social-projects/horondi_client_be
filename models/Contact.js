const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('../modules/common/ImageSet').schema;

const ContactSchema = new mongoose.Schema({
  phoneNumber: Number,
  openHours: [Language],
  address: {
    city: [Language],
    street: [Language],
    buildingNumber: [Language],
  },
  email: String,
  images: ImageSet,
  link: String
});

module.exports = mongoose.model('Contact', ContactSchema);