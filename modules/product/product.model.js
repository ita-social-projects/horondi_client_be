const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const PrimaryImage = require('../../models/PrimaryImage').schema;

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
  },
  name: [Language],
  description: [Language],
  mainMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
  },
  innerMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
  },
  bottomMaterial: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
  },
  strapLengthInCm: Number,
  images: PrimaryImage,
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
  },
  closure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Closure',
  },
  basePrice: [CurrencySet],
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
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
        ref: 'User',
      },
      rate: Number,
    },
  ],
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model('Product', productSchema);
