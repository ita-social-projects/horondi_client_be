const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const PrimaryImage = require('../../models/PrimaryImage').schema;
const ImageSet = require('../common/ImageSet').schema;
const Color = require('../../models/Color').schema;

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  model: [Language],
  name: [Language],
  description: [Language],
  mainMaterial: [Language],
  innerMaterial: [Language],
  strapLengthInCm: Number,
  images: PrimaryImage,
  colors: [Color],
  pattern: [Language],
  patternImages: ImageSet,
  closure: [Language],
  closureColor: String,
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
      bottomColor: [Language],
      additions: [
        {
          name: [Language],
          description: [Language],
          available: Boolean,
          additionalPrice: [CurrencySet]
        },
      ],
      availableCount: Number,
    },
  ],
  available: Boolean,
  isHotItem: Boolean,
  purchasedCount: Number,
  rate: Number,
  rateCount: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
