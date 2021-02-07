const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const IMAGE_NOT_PROVIDED = require('../../../error-messages/constructor-basic-messages.js');
const FIELD_ERROR_MESSAGE = require('../../../error-messages/common.messages');

const constructorBottomSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, FIELD_ERROR_MESSAGE],
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: [true, FIELD_ERROR_MESSAGE],
  },
  image: {
    type: String,
    required: [true, IMAGE_NOT_PROVIDED],
  },
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});
module.exports = mongoose.model('ConstructorBottom', constructorBottomSchema);
