const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  rate: {
    type: Number,
    default: 0,
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  show: Boolean,
});

module.exports = mongoose.model('Rate', rateSchema);
