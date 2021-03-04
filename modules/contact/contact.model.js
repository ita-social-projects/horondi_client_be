const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  PHONE_NUMBER_IS_TOO_SHORT,
  PHONE_NUMBER_IS_TOO_LONG,
  PHONE_NUMBER_IS_REQUIRED,
  PHONE_NUMBER_NOT_VALID,
  EMAIL_IS_REQUIRED,
  EMAIL_NOT_VALID,
  LINK_TOO_SHORT,
  LINK_TOO_LONG,
  LINK_IS_REQUIRED,
} = require('../../error-messages/common.messages');
const {
  PHONE_RANGES: { MIN_PHONE, MAX_PHONE },
  LINK_RANGES: { MIN_LINK, MAX_LINK },
} = require('../../consts/ranges');
const {
  DB_COLLECTIONS_NAMES: { CONTACT },
} = require('../../consts/db-collections-names');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    minlength: [MIN_PHONE, PHONE_NUMBER_IS_TOO_SHORT],
    maxlength: [MAX_PHONE, PHONE_NUMBER_IS_TOO_LONG],
    validate: {
      validator: function(v) {
        return /^\+?3?8?(0\d{9})$/.test(v);
      },
      message: PHONE_NUMBER_NOT_VALID,
    },
    required: [true, PHONE_NUMBER_IS_REQUIRED],
  },
  openHours: [Language],
  address: [Language],
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: EMAIL_NOT_VALID,
    },
    required: [true, EMAIL_IS_REQUIRED],
  },
  images: [
    {
      lang: String,
      value: ImageSet,
    },
  ],
  link: {
    type: String,
    minlength: [MIN_LINK, LINK_TOO_SHORT],
    maxlength: [MAX_LINK, LINK_TOO_LONG],
    required: [true, LINK_IS_REQUIRED],
  },
});

module.exports = mongoose.model(CONTACT, ContactSchema);
