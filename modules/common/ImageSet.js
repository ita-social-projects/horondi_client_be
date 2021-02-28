const mongoose = require('mongoose');

const {
  DB_TABLES_NAMES: { IMAGE_SET },
} = require('../../consts/db-tables-names');

const imageSetSchema = new mongoose.Schema({
  large: String,
  medium: String,
  small: String,
  thumbnail: String,
  _id: false,
  id: false,
});

module.exports = mongoose.model(IMAGE_SET, imageSetSchema);
