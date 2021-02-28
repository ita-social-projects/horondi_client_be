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
const {
  RANGES: { MIN, MAX },
} = require('../../consts/ranges');
const {
  DB_TABLES_NAMES: { ADDRESS },
} = require('../../consts/db-tables-names');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: [MIN, COUNTRY_LENGTH_TOO_SHORT],
    maxlength: [MAX, COUNTRY_LENGTH_TOO_LONG],
  },
  region: {
    type: String,
    minlength: [MIN, REGION_LENGTH_TOO_SHORT],
    maxlength: [MAX, REGION_LENGTH_TOO_LONG],
  },
  city: {
    type: String,
    minlength: [MIN, CITY_LENGTH_TOO_SHORT],
    maxlength: [MAX, CITY_LENGTH_TOO_LONG],
  },
  zipcode: {
    type: String,
    minlength: [MIN, ZIPCODE_LENGTH_TOO_SHORT],
    maxlength: [MAX, ZIPCODE_LENGTH_TOO_LONG],
  },
  street: {
    type: String,
    minlength: [MIN, STREET_LENGTH_TOO_SHORT],
    maxlength: [MAX, STREET_LENGTH_TOO_LONG],
  },
  buildingNumber: {
    type: String,
    minlength: [MIN, BUILDING_NUMBER_LENGTH_TOO_SHORT],
    maxlength: [MAX, BUILDING_NUMBER_LENGTH_TOO_LONG],
  },
  appartment: {
    type: String,
    minlength: [MIN, APPARTMENT_LENGTH_TOO_SHORT],
    maxlength: [MAX, APPARTMENT_LENGTH_TOO_LONG],
  },
});

module.exports = mongoose.model(ADDRESS, addressSchema);
