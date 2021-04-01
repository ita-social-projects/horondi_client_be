const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Blocker = require('../blocker/blocker.model').schema;
const Side = require('../../models/Side').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, POCKET, SIDE },
} = require('../../consts/db-collections-names');

const pocketSchema = new mongoose.Schema({
  name: [Language],
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  features: [Side],
  blockers: [Blocker],
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(POCKET, pocketSchema);
