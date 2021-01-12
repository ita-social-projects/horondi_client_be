const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const ImageSet = require('../../common/ImageSet').schema;

const constructorBasicSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  image: String,
  basePrice: [CurrencySet],
  available: Boolean
});

module.exports = mongoose.model('ConstructorBasic', constructorBasicSchema);
