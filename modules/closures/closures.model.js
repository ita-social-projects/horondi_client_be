const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;

const closureSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
});

module.exports = mongoose.model('Closure', closureSchema);
