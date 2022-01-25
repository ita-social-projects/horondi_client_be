const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { MATERIALS },
} = require('../../consts/db-collections-names');

const MaterialsSchema = new mongoose.Schema({
  heading: String,
  text: String,
  image: String,
});

module.exports = mongoose.model(MATERIALS, MaterialsSchema);
