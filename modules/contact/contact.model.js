const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  PHONE_NUMBER_IS_TO_SHORT,
  PHONE_NUMBER_IS_TO_LONG,
  PHONE_NUMBER_IS_REQUIRED,
  EMAIL_IS_REQUIRED,
  EMAIL_NOT_VALID,
  LINK_TO_SHORT,
  LINK_TO_LONG,
  LINK_IS_REQUIRED,
} = require('../../error-messages/common.messages');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    minlength: [10, PHONE_NUMBER_IS_TO_SHORT],
    maxlength: [13, PHONE_NUMBER_IS_TO_LONG],
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
    minlength: [2, LINK_TO_SHORT],
    maxlength: [30, LINK_TO_LONG],
    required: [true, LINK_IS_REQUIRED],
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
