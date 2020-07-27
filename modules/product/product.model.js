const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const PrimaryImage = require('../../models/PrimaryImage').schema;
const ImageSet = require('../common/ImageSet').schema;
const Color = require('../../models/Color').schema;

const productSchema = new mongoose.Schema({
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: [Language],
  description: [Language],
  mainMaterial: [Language],
  innerMaterial: [Language],
  strapLengthInCm: Number,
  images: [PrimaryImage],
  colors: [Color],
  pattern: [Language],
  patternImages: ImageSet,
  closure: [Language],
  closureColor: String,
  basePrice: Number,
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
      bottomColor: String,
      additions: [
        {
          name: [Language],
          description: [Language],
          available: Boolean,
          additionalPrice: {
            type: Number,
            default: 0,
          },
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
  votedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
