const mongoose = require('mongoose');

const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  IMAGE_NOT_PROVIDED,
} = require('../../../error-messages/constructor-front-pocket-messages');
const {
  RANGES: { MIN, MAX },
} = require('../../../consts/ranges');
const {
  DB_COLLECTIONS_NAMES: { CONSTRUCTOR_FRONT_POCKET, MATERIAL, COLOR },
} = require('../../../consts/db-collections-names');

const constructorFrontPocketSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLOR,
  },
  image: {
    type: String,
    minlength: [MIN, IMAGE_NOT_PROVIDED],
    maxlength: [MAX, IMAGE_NOT_PROVIDED],
  },
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(
  CONSTRUCTOR_FRONT_POCKET,
  constructorFrontPocketSchema
);
