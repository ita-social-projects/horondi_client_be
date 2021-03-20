const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { POCKET, BLOCKER },
} = require('../../consts/db-collections-names');

const blockerSchema = new mongoose.Schema({
  name: String,
  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: POCKET,
  },
});

module.exports = mongoose.model(BLOCKER, blockerSchema);
