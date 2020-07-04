const mongoose = require('mongoose');

const SizeSchema = new mongoose.Schema({
  name: String,
  heightInCm: Number,
  widthInCm: Number,
  depthInCm: Number,
  volumeInLiters: Number,
  weight: Number,
  available: Boolean,
});

module.exports = mongoose.model('Size', SizeSchema);
