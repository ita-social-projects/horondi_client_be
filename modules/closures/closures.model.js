const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const IMAGE_NOT_PROVIDED = require('../../error-messages/constructor-basic-messages.js');
const MATERIAL_NOT_FOUND = require('../../error-messages/material.messages');

const closureSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, MATERIAL_NOT_FOUND],
  },
  image: {
    type: String,
    required: [true, IMAGE_NOT_PROVIDED],
  },
  additionalPrice: [CurrencySet],
  available: Boolean,
});

module.exports = mongoose.model('Closure', closureSchema);
