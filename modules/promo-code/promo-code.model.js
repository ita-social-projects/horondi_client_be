const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { PROMO },
} = require('../../consts/db-collections-names');

const promoCodeSchema = new mongoose.Schema({
  dateFrom: String,
  dateTo: String,
  code: String,
  discount: Number,
});

module.exports = mongoose.model(PROMO, promoCodeSchema);
