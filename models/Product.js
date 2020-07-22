const mongoose = require('mongoose');
const Language = require('./Language').schema;
const PrimaryImage = require('./PrimaryImage').schema;
const ImageSet = require('../modules/common/ImageSet').schema;
const Size = require('./Size').schema;
const Color = require('./Color').schema;

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
      size: Size,
      bottomMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
      },
      bottomColor: String,
      additions: [{
        name: [Language],
        description: [Language],
        available: Boolean,
        additionalPrice: {
          type: Number,
          default: 0,
        },
      }],
      availableNumber: Number,
    },
  ],
  available: Boolean,
  isHotItem: Boolean,
  purchasedNumber: Number,
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
