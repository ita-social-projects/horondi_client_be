const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const orderItemSchema = new mongoose.Schema({
  _id: false,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
  },
  actualPrice: [CurrencySet],
  quantity: {
    type: Number,
    required: true,
  },
  isFromConstructor: {
    type: Boolean,
    default: false,
  },
  options: {
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
    },
    sidePocket: {
      type: Boolean,
      default: false,
    },
  },
  constructorBasics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'constructorBasics',
  },
  constructorBottom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'constructorBottom',
  },
  constructorFrontPocket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'constructorFrontPocket',
  },
  constructorPattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
  },
  fixedPrice: [CurrencySet],
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
