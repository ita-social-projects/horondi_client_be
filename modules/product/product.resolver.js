const productsService = require('./product.service');

const productsQuery = {
  getProductById: (parent, args) => productsService.getProductById(args.id),
  getProducts: async (parent, args) => {
    try {
      return await productsService.getProducts(args);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const productsMutation = {
  addProduct: (parent, args) => productsService.addProduct(args.product),
  deleteProduct: (parent, args) => productsService.deleteProduct(args.id),
  updateProduct: (parent, args) => productsService.updateProduct(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
