const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const modelSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: [Language],
  description: [Language],
  images: ImageSet,
  priority: Number,
  show: Boolean,
  availableForConstructor: Boolean,
  constructorBasic: [{ type:mongoose.Schema.Types.ObjectId, ref: 'ConstructorBasic'}],
  constructorPattern: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Pattern'}],
  constructorBottom: [{ type:mongoose.Schema.Types.ObjectId, ref: 'ConstructorBottom'}],
  constructorFrontPocket: [{ type:mongoose.Schema.Types.ObjectId, ref: 'ConstructorFrontPocket'}],
});

module.exports = mongoose.model('Model', modelSchema);
