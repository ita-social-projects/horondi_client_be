const productsService = require('./product.service');

const productsQuery = {
  getProductsById: (parent, args) => productsService.getProductsById(args.id),
  getPaginatedProducts: async (parent, args) => {
    try {
      return await productsService.getPaginatedProducts(args);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const productsMutation = {
  addProduct: (parent, args) => productsService.addProduct(args.products),
  deleteProduct: (parent, args) => productsService.deleteProduct(args.id),
  updateProduct: (parent, args) => productsService.updateProduct(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
