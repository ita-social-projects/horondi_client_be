const productsService = require('./product.service');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');

const productsQuery = {
  getProducts: (parent, args) => productsService.getProducts(args),
  getProductById: async (parent, args) => {
    const product = await productsService.getProductById(args.id);
    if (product) {
      return product;
    }
    return {
      statusCode: 404,
      message: PRODUCT_NOT_FOUND,
    };
  },
};

const productsMutation = {
  addProduct: (parent, args) => productsService.addProduct(args.products),
  deleteProduct: (parent, args) => productsService.deleteProduct(args.id),
  updateProduct: (parent, args) => productsService.updateProduct(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
