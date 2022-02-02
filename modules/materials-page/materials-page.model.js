const mongoose = require('mongoose');
const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const Language = require('../../models/Language').schema;

const {
  DB_COLLECTIONS_NAMES: { MATERIALS },
} = require('../../consts/db-collections-names');

const MaterialsSchema = new mongoose.Schema({
  image: String,
  text: [Language],
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(MATERIALS, MaterialsSchema);
