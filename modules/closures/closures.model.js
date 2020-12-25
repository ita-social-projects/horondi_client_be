const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet');
const Language = require('../../models/Language');

const ClosureSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
});

module.exports = mongoose.model('Closure', ClosureSchema);
