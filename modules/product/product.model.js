const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const PrimaryImage = require('../../models/PrimaryImage').schema;
const {
  DB_COLLECTIONS_NAMES: {
    CATEGORY,
    MODEL,
    MATERIAL,
    COLOR,
    PATTERN,
    CLOSURE,
    SIZE,
    USER,
    COMMENT,
    PRODUCT,
  },
} = require('../../consts/db-collections-names');

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CATEGORY,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  name: [Language],
  description: [Language],
  mainMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  innerMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  bottomMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  strapLengthInCm: Number,
  images: PrimaryImage,
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PATTERN,
  },
  closure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CLOSURE,
  },
  basePrice: [CurrencySet],
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SIZE,
    },
  ],
  available: Boolean,
  isHotItem: Boolean,
  purchasedCount: {
    type: Number,
    default: 0,
  },
  availableCount: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
  },
  rateCount: {
    type: Number,
    default: 0,
  },
  userRates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
      },
      rate: Number,
    },
  ],
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COMMENT,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model(PRODUCT, productSchema);
