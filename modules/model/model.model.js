const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const Size = require('../size/size.model').schema;

const modelSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: [Language],
  description: [Language],
  images: ImageSet,
  priority: Number,
  show: Boolean,
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
    },
  ],
});

module.exports = mongoose.model('Model', modelSchema);
