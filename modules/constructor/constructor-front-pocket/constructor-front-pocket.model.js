const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const ImageSet = require('../../common/ImageSet').schema;

const constructorFrontPocketSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  images: ImageSet,
  basePrice: [CurrencySet],
  available: Boolean
});

module.exports = mongoose.model('ConstructorFrontPocket', constructorFrontPocketSchema);
