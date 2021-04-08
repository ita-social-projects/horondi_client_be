const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Blocker = require('../blocker/blocker.model').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, POCKET },
} = require('../../consts/db-collections-names');
const { RIGHT, LEFT, FRONT, BACK } = require('../../consts/side-names');

const pocketSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  features: {
    side: [
      {
        type: String,
        enum: [RIGHT, LEFT, FRONT, BACK],
        required: true,
      },
    ],
    state: String,
  },
  blockers: [Blocker],
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(POCKET, pocketSchema);
