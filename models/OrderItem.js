const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const orderItemSchema = new mongoose.Schema({
  _id: false,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
  constructorBasics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'constructorBasics',
  },
  constructorBasics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'constructorBasics',
  },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
