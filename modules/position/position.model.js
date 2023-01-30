const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;

const {
  DB_COLLECTIONS_NAMES: { POSITION, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const PositionSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  available: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(POSITION, PositionSchema);
