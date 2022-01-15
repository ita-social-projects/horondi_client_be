const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { ABOUT_US },
} = require('../../consts/db-collections-names');

const AboutUsSchema = new mongoose.Schema({
  title: { type: String },
  text: { type: String },
  image: { type: String },
});

module.exports = mongoose.model(ABOUT_US, AboutUsSchema);
