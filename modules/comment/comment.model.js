const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    email: String,
    name: String,
    images: ImageSet,
    isAdmin: Boolean,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  show: Boolean,
});

module.exports = mongoose.model('Comment', commentSchema);
