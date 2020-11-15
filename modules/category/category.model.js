const mongoose = require('mongoose');
const Product = require('../product/product.model');
const Model = require('../model/model.model');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const CategorySchema = new mongoose.Schema({
  code: String,
  name: [Language],
  images: ImageSet,
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  isMain: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
