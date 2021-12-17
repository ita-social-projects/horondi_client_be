const productsService = require('./product.service');
const RuleError = require('../../errors/rule.error');

const productsQuery = {
  getProductById: async (parent, args) => {
    try {
      return await productsService.getProductById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getProducts: async (parent, args) => {
    try {
      return await productsService.getProducts(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getModelsByCategory: (parent, args) => productsService.getModelsByCategory(args.id),
  getPopularProducts: () => productsService.getPopularProducts(),
  getProductsFilters: () => productsService.getProductsFilters(),
};

const productsMutation = {
  addProduct: async (parent, args, { user }) => {
    try {
      return await productsService.addProduct(args.product, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteProduct: async (parent, args, { user }) => {
    try {
      return await productsService.deleteProduct(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateProduct: async (parent, args, { user }) => {
    try {
      return await productsService.updateProduct(
        args.id,
        args.product,
        args.upload,
        args.primary,
        user,
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteImages: async (parent, args) => {
    try {
      return await productsService.deleteImages(args.id, args.images);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { productsQuery, productsMutation };
