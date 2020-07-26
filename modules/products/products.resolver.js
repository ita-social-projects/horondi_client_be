const productsService = require('./products.service');

const productsQuery = {
  getAllProducts: () => productsService.getAllProducts(),
  getProductsById: (parent, args) => productsService.getProductsById(args.id),
  getProductsByOptions:  (parent, args) => productsService.getProductsByOptions(args) 
  
};


const productsMutation = {
  addProducts: (parent, args) => productsService.addProducts(args.products),
  deleteProducts: (parent, args) => productsService.deleteProducts(args.id),
  updateProductById: (parent, args) => productsService.updateProductById(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
