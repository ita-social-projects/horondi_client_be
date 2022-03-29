const mongoose = require('mongoose');

const CurrencySet = require('./CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: {
    ORDER_ITEM,
    PRODUCT,
    MODEL,
    SIZE,
    CONSTRUCTOR_BASICS,
    CONSTRUCTOR_BOTTOM,
    CONSTRUCTOR_FRONT_POCKET,
    PATTERN,
  },
} = require('../consts/db-collections-names');

const orderItemSchema = new mongoose.Schema({
  _id: false,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
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
      ref: SIZE,
    },
    sidePocket: {
      type: Boolean,
      default: false,
    },
  },
  constructorBasics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONSTRUCTOR_BASICS,
  },
  constructorBottom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONSTRUCTOR_BOTTOM,
  },
  constructorFrontPocket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONSTRUCTOR_FRONT_POCKET,
  },
  constructorPattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PATTERN,
  },
  fixedPrice: [CurrencySet],
  discount: {
    type: Number,
    default: 0,
  },
  priceWithDiscount: [CurrencySet],
});

module.exports = mongoose.model(ORDER_ITEM, orderItemSchema);
