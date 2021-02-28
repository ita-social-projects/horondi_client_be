const mongoose = require('mongoose');

const Language = require('./Language').schema;
const {
  DB_COLLECTIONS_NAMES: { BUSINESS_TEXT },
} = require('../consts/db-collections-names');

const businessTextSchema = new mongoose.Schema({
  code: String,
  title: [Language],
  text: [Language],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(BUSINESS_TEXT, businessTextSchema);
