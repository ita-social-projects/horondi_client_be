const mongoose = require('mongoose');
const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const Language = require('../../models/Language').schema;
const Coordinats = require('../../models/Coordinats').schema;
const {
  DB_COLLECTIONS_NAMES: { CONTACT },
} = require('../../consts/db-collections-names');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  openHours: [Language],
  address: [Language],
  email: {
    type: String,
  },
  link: Coordinats,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(CONTACT, ContactSchema);
