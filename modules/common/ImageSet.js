const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { IMAGE_SET },
} = require('../../consts/db-collections-names');

const imageSetSchema = new mongoose.Schema({
  large: String,
  medium: String,
  small: String,
  thumbnail: String,
  _id: false,
  id: false,
});

module.exports = mongoose.model(IMAGE_SET, imageSetSchema);
