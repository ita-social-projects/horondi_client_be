const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const orderItemSchema = new mongoose.Schema({
  _id: false,
  product: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    fixedPrice: [CurrencySet],
  },
  modelId: {
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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
      },
      fixedPrice: [CurrencySet],
    },
    sidePocket: {
      type: Boolean,
      default: false,
    },
  },
  constructorBasics: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'constructorBasics',
    },
    fixedPrice: [CurrencySet],
  },
  constructorBottom: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'constructorBottom',
    },
    fixedPrice: [CurrencySet],
  },
  constructorFrontPocket: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'constructorFrontPocket',
    },
    fixedPrice: [CurrencySet],
  },
  constructorPattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
  },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
