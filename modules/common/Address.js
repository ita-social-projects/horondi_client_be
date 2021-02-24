const mongoose = require('mongoose');
const {
  COUNTRY_LENGTH_TOO_SHORT,
  COUNTRY_LENGTH_TOO_LONG,
  REGION_LENGTH_TOO_SHORT,
  REGION_LENGTH_TOO_LONG,
  CITY_LENGTH_TOO_SHORT,
  CITY_LENGTH_TOO_LONG,
  ZIPCODE_LENGTH_TOO_SHORT,
  ZIPCODE_LENGTH_TOO_LONG,
  STREET_LENGTH_TOO_SHORT,
  STREET_LENGTH_TOO_LONG,
  BUILDING_NUMBER_LENGTH_TOO_SHORT,
  BUILDING_NUMBER_LENGTH_TOO_LONG,
  APPARTMENT_LENGTH_TOO_SHORT,
  APPARTMENT_LENGTH_TOO_LONG,
} = require('../../error-messages/address.messages');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: [2, COUNTRY_LENGTH_TOO_SHORT],
    maxlength: [20, COUNTRY_LENGTH_TOO_LONG],
  },
  region: {
    type: String,
    minlength: [2, REGION_LENGTH_TOO_SHORT],
    maxlength: [20, REGION_LENGTH_TOO_LONG],
  },
  city: {
    type: String,
    minlength: [2, CITY_LENGTH_TOO_SHORT],
    maxlength: [20, CITY_LENGTH_TOO_LONG],
  },
  zipcode: {
    type: String,
    minlength: [2, ZIPCODE_LENGTH_TOO_SHORT],
    maxlength: [20, ZIPCODE_LENGTH_TOO_LONG],
  },
  street: {
    type: String,
    minlength: [2, STREET_LENGTH_TOO_SHORT],
    maxlength: [20, STREET_LENGTH_TOO_LONG],
  },
  buildingNumber: {
    type: String,
    minlength: [2, BUILDING_NUMBER_LENGTH_TOO_SHORT],
    maxlength: [20, BUILDING_NUMBER_LENGTH_TOO_LONG],
  },
  appartment: {
    type: String,
    minlength: [2, APPARTMENT_LENGTH_TOO_SHORT],
    maxlength: [20, APPARTMENT_LENGTH_TOO_LONG],
  },
});

module.exports = mongoose.model('Address', addressSchema);
