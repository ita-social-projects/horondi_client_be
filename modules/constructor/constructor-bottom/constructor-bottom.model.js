const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;

const constructorBottomSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
  },
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});
module.exports = mongoose.model('ConstructorBottom', constructorBottomSchema);
