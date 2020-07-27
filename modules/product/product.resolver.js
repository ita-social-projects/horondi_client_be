const productsService = require('./product.service');

const productsQuery = {
  getProductsById: (parent, args) => productsService.getProductsById(args.id),
  getProducts: (parent, args) => productsService.getProducts(args),
};

const productsMutation = {
  addProducts: (parent, args) => productsService.addProducts(args.products),
  deleteProducts: (parent, args) => productsService.deleteProducts(args.id),
  updateProductById: (parent, args) => productsService.updateProductById(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
