const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MATERIAL, COLOR, SIDE_POCKET },
} = require('../../consts/db-collections-names');

const sidePocketSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLOR,
  },
  side: {
    type: String,
    enum: ['left', 'right', 'hidden'],
    default: 'left',
  },
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(SIDE_POCKET, sidePocketSchema);
