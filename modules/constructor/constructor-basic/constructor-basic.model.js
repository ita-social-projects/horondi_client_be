const mongoose = require('mongoose');
const Yup = require('yup');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  IMAGE_NOT_PROVIDED,
} = require('../../../error-messages/constructor-basic-messages');

const constructorBasicSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
  },
  image: Yup.string().required(IMAGE_NOT_PROVIDED),
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model('ConstructorBasic', constructorBasicSchema);
