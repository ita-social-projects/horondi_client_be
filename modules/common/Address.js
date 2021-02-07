const mongoose = require('mongoose');
const INPUT_VALIDATION_ERROR = require('../../error-messages/common.messages');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  region: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  city: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  zipcode: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  street: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  buildingNumber: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  appartment: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
});

module.exports = mongoose.model('Address', addressSchema);
