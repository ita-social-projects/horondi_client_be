const mongoose = require('mongoose');

const imageSetSchema = new mongoose.Schema({
  _id: false,
  id: false,
  large: String,
  medium: String,
  small: String,
  thumbnail: String,
});

module.exports = mongoose.model('ImageSet', imageSetSchema);
