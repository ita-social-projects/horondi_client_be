const mongoose = require('mongoose');

const imageSetSchema = new mongoose.Schema({
  large: String,
  medium: String,
  small: String,
  thumbnail: String,
});

module.exports = mongoose.model('ImageSet', imageSetSchema);
