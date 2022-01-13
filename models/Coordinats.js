const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { COORDINATS },
} = require('../consts/db-collections-names');

const coordsSetSchema = new mongoose.Schema({
  lat: String,
  lon: String,
});

module.exports = mongoose.model(COORDINATS, coordsSetSchema);
