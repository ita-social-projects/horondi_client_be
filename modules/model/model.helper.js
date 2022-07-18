const Product = require('../product/product.model');
const Model = require('./model.model');
const productService = require('../product/product.service');
const RuleError = require('../../errors/rule.error');
const { MODEL_NOT_FOUND } = require('../../error-messages/model.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const removeSizesFromProducts = async (id, newModel) => {
  const modelToUpdate = await Model.findById(id).exec();
  if (!modelToUpdate) {
    throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
  }

  const newSizes = newModel.sizes.filter(size => size._id);
  const sizesDiff = modelToUpdate.sizes
    .filter(size =>
      newSizes.every(newSize => newSize._id !== size._id.toString())
    )
    .map(size => size._id);

  const { items: products } = await productService.getProducts({
    filter: {
      models: modelToUpdate.id,
    },
  });

  products.forEach(async product => {
    await Product.findByIdAndUpdate(
      { _id: product._id },
      { $pull: { sizes: { size: { $in: sizesDiff } } } }
    );
  });
};

module.exports = { removeSizesFromProducts };
