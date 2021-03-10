const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Language = require('../../models/Language').schema;
const {
  SIZE_NAME_TOO_SHORT,
  SIZE_NAME_TOO_LONG,
  SIZE_NAME_IS_REQUIRED,
  HEIGHT_IN_CM_TOO_SHORT,
  HEIGHT_IN_CM_TOO_LONG,
  HEIGHT_IN_CM_IS_REQUIRED,
  WIDTH_IN_CM_TOO_SHORT,
  WIDTH_IN_CM_TOO_LONG,
  WIDTH_IN_CM_IS_REQUIRED,
  DEPTH_IN_CM_TOO_SHORT,
  DEPTH_IN_CM_TOO_LONG,
  DEPTH_IN_CM_IS_REQUIRED,
  VOLUME_IN_LITERS_TOO_SHORT,
  VOLUME_IN_LITERS_TOO_LONG,
  VOLUME_IN_LITERS_IS_REQUIRED,
  WEIGHT_IN_KG_TOO_SHORT,
  WEIGHT_IN_KG_TOO_LONG,
  WEIGHT_IN_KG_IS_REQUIRED,
} = require('../../error-messages/size.messages');
const {
  DB_COLLECTIONS_NAMES: { SIZE },
} = require('../../consts/db-collections-names');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [1, SIZE_NAME_TOO_SHORT],
    maxlength: [2, SIZE_NAME_TOO_LONG],
    required: [true, SIZE_NAME_IS_REQUIRED],
  },
  simpleName: [Language],
  heightInCm: {
    type: Number,
    min: [1, HEIGHT_IN_CM_TOO_SHORT],
    max: [35, HEIGHT_IN_CM_TOO_LONG],
    required: [true, HEIGHT_IN_CM_IS_REQUIRED],
  },
  widthInCm: {
    type: Number,
    min: [1, WIDTH_IN_CM_TOO_SHORT],
    max: [35, WIDTH_IN_CM_TOO_LONG],
    required: [true, WIDTH_IN_CM_IS_REQUIRED],
  },
  depthInCm: {
    type: Number,
    min: [1, DEPTH_IN_CM_TOO_SHORT],
    max: [35, DEPTH_IN_CM_TOO_LONG],
    required: [true, DEPTH_IN_CM_IS_REQUIRED],
  },
  volumeInLiters: {
    type: Number,
    min: [1, VOLUME_IN_LITERS_TOO_SHORT],
    max: [35, VOLUME_IN_LITERS_TOO_LONG],
    required: [true, VOLUME_IN_LITERS_IS_REQUIRED],
  },
  weightInKg: {
    type: Number,
    min: [0.1, WEIGHT_IN_KG_TOO_SHORT],
    max: [5, WEIGHT_IN_KG_TOO_LONG],
    required: [true, WEIGHT_IN_KG_IS_REQUIRED],
  },
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model(SIZE, sizeSchema);
