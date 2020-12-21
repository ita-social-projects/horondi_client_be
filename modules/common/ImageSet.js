const mongoose = require('mongoose');

const imageSetSchema = new mongoose.Schema({
  large: String,
  medium: String,
  small: String,
  thumbnail: String,
  _id: false,
  id: false,
});

module.exports = mongoose.model('ImageSet', imageSetSchema);
