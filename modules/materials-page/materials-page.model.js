const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { MATERIALS },
} = require('../../consts/db-collections-names');

const MaterialsSchema = new mongoose.Schema({
  heading: { type: String },
  title: { type: String },
  text: { type: String },
  image: { type: String },
});

module.exports = mongoose.model(MATERIALS, MaterialsSchema);
