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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  innerMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  strapLengthInCm: Number,
  images: PrimaryImage,
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
  ],
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
  },
  closure: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Closure',
    },
  ],
  basePrice: [CurrencySet],
  options: [
    {
      size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
      },
      bottomMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
      },
      bottomColor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
      },
      additions: [
        {
          name: [Language],
          description: [Language],
          available: Boolean,
          additionalPrice: [CurrencySet],
        },
      ],
      availableCount: Number,
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
