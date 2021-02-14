const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  PHONE_NUMBER_NOT_VALID,
  EMAIL_IS_REQUIRED,
  EMAIL_NOT_VALID,
  INPUT_NOT_VALID,
} = require('../../error-messages/common.messages');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    minlength: [10, PHONE_NUMBER_NOT_VALID],
    maxlength: [13, PHONE_NUMBER_NOT_VALID],
    required: [true, PHONE_NUMBER_NOT_VALID],
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
    minlength: [2, INPUT_NOT_VALID],
    maxlength: [30, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
