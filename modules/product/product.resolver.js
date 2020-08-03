const productsService = require('./product.service');

const productsQuery = {
  getProductsById: (parent, args) => productsService.getProductsById(args.id),
  getProducts: async (parent, args) => {
    const products = await productsService.getProducts(args);
    const productsCount = await productsService.getProductsCount(args);
    return {
      products,
      productsCount,
    };
  },
};

const productsMutation = {
  addProduct: (parent, args) => productsService.addProduct(args.products),
  deleteProduct: (parent, args) => productsService.deleteProduct(args.id),
  updateProduct: (parent, args) => productsService.updateProduct(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
