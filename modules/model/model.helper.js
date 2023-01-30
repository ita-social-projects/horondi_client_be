const Product = require('../product/product.model');
const productService = require('../product/product.service');
const modelService = require('./model.service');

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

module.exports = {
  removeSizesFromProducts,
};
