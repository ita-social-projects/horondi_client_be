const { ObjectId } = require('mongoose').Types;
const Product = require('../product/product.model');
const Model = require('./model.model');
const productService = require('../product/product.service');
const modelService = require('./model.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const { MODEL_NOT_VALID } = require('../../error-messages/model.messages');
const RuleError = require('../../errors/rule.error');

const removeSizesFromProducts = async (id, newModel) => {
  const modelToUpdate = await modelService.getModelById(id);

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
    ).exec();
  });
};

const checkModelForSoftDeletion = async modelId => {
  if (!ObjectId.isValid(modelId)) {
    throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
  }
  const products = await Product.find({ model: modelId }).exec();
  if (!products.length) {
    return null;
  }

  const update = {
    $set: {
      isDeleted: true,
      deletedAt: Date.now(),
    },
  };

  return await Model.findByIdAndUpdate(modelId, update, { new: true }).exec();
};

module.exports = {
  removeSizesFromProducts,
  checkModelForSoftDeletion,
};
