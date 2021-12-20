const mongoose = require('mongoose');

const {
  COUNTRY_LENGTH_TOO_LONG,
  REGION_LENGTH_TOO_LONG,
  CITY_LENGTH_TOO_LONG,
  ZIPCODE_LENGTH_TOO_LONG,
  STREET_LENGTH_TOO_LONG,
  BUILDING_NUMBER_LENGTH_TOO_LONG,
  APPARTMENT_LENGTH_TOO_LONG,
} = require('../../error-messages/address.messages');
const {
  RANGES: { MAX },
} = require('../../consts/ranges');
const {
  DB_COLLECTIONS_NAMES: { ADDRESS },
} = require('../../consts/db-collections-names');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    maxlength: [MAX, COUNTRY_LENGTH_TOO_LONG],
  },
  region: {
    type: String,
    maxlength: [MAX, REGION_LENGTH_TOO_LONG],
  },
  city: {
    type: String,
    maxlength: [MAX, CITY_LENGTH_TOO_LONG],
  },
  zipcode: {
    type: String,
    maxlength: [MAX, ZIPCODE_LENGTH_TOO_LONG],
  },
  street: {
    type: String,
    maxlength: [MAX, STREET_LENGTH_TOO_LONG],
  },
  buildingNumber: {
    type: String,
    maxlength: [MAX, BUILDING_NUMBER_LENGTH_TOO_LONG],
  },
  appartment: {
    type: String,
    maxlength: [MAX, APPARTMENT_LENGTH_TOO_LONG],
  },
});

module.exports = mongoose.model(ADDRESS, addressSchema);
