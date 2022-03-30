const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { PROMO },
} = require('../../consts/db-collections-names');

const promoCodeSchema = new mongoose.Schema({
  dateFrom: Date,
  dateTo: Date,
  code: String,
  discount: Number,
  categories: [String],
});

module.exports = mongoose.model(PROMO, promoCodeSchema);
