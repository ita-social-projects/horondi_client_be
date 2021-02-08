const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  FIELD_ERROR_MESSAGE,
  PHONE_NUMBER_NOT_VALID,
} = require('../../error-messages/common.messages');
const {
  EMAIL_ERROR,
  EMAIL_VALIDATION_ERROR,
} = require('../../error-messages/user.messages');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    min: [12, PHONE_NUMBER_NOT_VALID],
    max: [12, PHONE_NUMBER_NOT_VALID],
    required: [true, FIELD_ERROR_MESSAGE],
  },
  openHours: [Language],
  address: [Language],
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: EMAIL_VALIDATION_ERROR,
    },
    required: [true, EMAIL_ERROR],
  },
  images: [
    {
      lang: String,
      value: ImageSet,
    },
  ],
  link: {
    type: String,
    minlength: [1, FIELD_ERROR_MESSAGE],
    required: [true, FIELD_ERROR_MESSAGE],
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
