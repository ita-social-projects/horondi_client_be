const mongoose = require('mongoose');
const {
  COUNTRY_LENGTH_TO_SHORT,
  COUNTRY_LENGTH_TO_LONG,
  REGION_LENGTH_TO_SHORT,
  REGION_LENGTH_TO_LONG,
  CITY_LENGTH_TO_SHORT,
  CITY_LENGTH_TO_LONG,
  ZIPCODE_LENGTH_TO_SHORT,
  ZIPCODE_LENGTH_TO_LONG,
  STREET_LENGTH_TO_SHORT,
  STREET_LENGTH_TO_LONG,
  BUILDINGNUMBER_LENGTH_TO_SHORT,
  BUILDINGNUMBER_LENGTH_TO_LONG,
  APPARTMENT_LENGTH_TO_SHORT,
  APPARTMENT_LENGTH_TO_LONG,
} = require('../../error-messages/address.messages');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: [2, COUNTRY_LENGTH_TO_SHORT],
    maxlength: [20, COUNTRY_LENGTH_TO_LONG],
  },
  region: {
    type: String,
    minlength: [2, REGION_LENGTH_TO_SHORT],
    maxlength: [20, REGION_LENGTH_TO_LONG],
  },
  city: {
    type: String,
    minlength: [2, CITY_LENGTH_TO_SHORT],
    maxlength: [20, CITY_LENGTH_TO_LONG],
  },
  zipcode: {
    type: String,
    minlength: [2, ZIPCODE_LENGTH_TO_SHORT],
    maxlength: [20, ZIPCODE_LENGTH_TO_LONG],
  },
  street: {
    type: String,
    minlength: [2, STREET_LENGTH_TO_SHORT],
    maxlength: [20, STREET_LENGTH_TO_LONG],
  },
  buildingNumber: {
    type: String,
    minlength: [2, BUILDINGNUMBER_LENGTH_TO_SHORT],
    maxlength: [20, BUILDINGNUMBER_LENGTH_TO_LONG],
  },
  appartment: {
    type: String,
    minlength: [2, APPARTMENT_LENGTH_TO_SHORT],
    maxlength: [20, APPARTMENT_LENGTH_TO_LONG],
  },
});

module.exports = mongoose.model('Address', addressSchema);
