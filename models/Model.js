const mongoose = require('mongoose');
const Language = require('./Language').schema;
const ImageSet = require('../modules/common/ImageSet').schema;

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
  link: String,
  priority: Number,
  show: Boolean
});

module.exports = mongoose.model('Model', modelSchema);