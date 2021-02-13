const mongoose = require('mongoose');
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  region: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  city: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  zipcode: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  street: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  buildingNumber: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
  appartment: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [20, 'INPUT_NOT_VALID'],
  },
});

module.exports = mongoose.model('Address', addressSchema);
