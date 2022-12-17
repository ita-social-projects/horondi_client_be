const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: {
    ORDER_ITEM,
    PRODUCT,
    MODEL,
    CONSTRUCTOR_FRONT_POCKET,
    PATTERN,
    BASICS,
    BOTTOM,
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
    },
    sidePocket: {
      type: Boolean,
      default: false,
    },
  },
  constructorBasics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: BASICS,
  },
  constructorBottom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: BOTTOM,
  },
  constructorFrontPocket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONSTRUCTOR_FRONT_POCKET,
  },
  constructorPattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PATTERN,
  },
  fixedPrice: Number,
});

module.exports = mongoose.model(ORDER_ITEM, orderItemSchema);
