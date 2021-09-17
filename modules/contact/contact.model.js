const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { CONTACT },
} = require('../../consts/db-collections-names');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  openHours: [Language],
  address: [Language],
  email: {
    type: String,
  },
  images: [
    {
      lang: String,
      value: ImageSet,
    },
  ],
  link: {
    type: String,
  },
});

module.exports = mongoose.model(CONTACT, ContactSchema);
