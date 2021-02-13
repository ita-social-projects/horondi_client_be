const mongoose = require('mongoose');

const imageSetSchema = new mongoose.Schema({
  large: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  medium: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  small: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  thumbnail: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
});

module.exports = mongoose.model('ImageSet', imageSetSchema);
