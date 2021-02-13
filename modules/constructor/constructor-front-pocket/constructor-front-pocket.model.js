const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  IMAGE_NOT_PROVIDED,
} = require('../../../error-messages/constructor-front-pocket-messages');

const constructorFrontPocketSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
  },
  image: {
    type: String,
    minlength: [2, 'IMAGE_NOT_PROVIDED'],
    maxlength: [20, 'IMAGE_NOT_PROVIDED'],
  },
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(
  'ConstructorFrontPocket',
  constructorFrontPocketSchema
);
