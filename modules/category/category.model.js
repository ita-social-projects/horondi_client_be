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

CategorySchema.pre('findOneAndDelete', async function(next) {
  const query = this.getQuery();
  const thisCategory = await this.model.findOne(query);
  const noneCategory = await this.model.findOne({ code: 'none' });

  const updateFilter = {
    category: query._id,
  };

  const updateSettings = {
    $set: { category: mongoose.Types.ObjectId(noneCategory._id) },
  };

  if (!thisCategory.isMain) {
    const parentCategory = await this.model.findOne({
      subcategories: { $in: [id] },
    });
    await this.model.updateById(parentCategory._id, {
      $pull: { subcategories: { $in: [id] } },
    });
  }

  await Product.updateMany(updateFilter, updateSettings);

  await Model.updateMany(updateFilter, updateSettings);

  next();
});

module.exports = mongoose.model('Category', CategorySchema);
