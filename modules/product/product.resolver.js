const productsService = require('./product.service');
const RuleError = require('../../errors/rule.error');

const productsQuery = {
  getProductById: async (_parent, args) => {
    try {
      return await productsService.getProductById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getProducts: async (_parent, args) => {
    try {
      return await productsService.getProducts(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getModelsByCategory: (_parent, args) =>
    productsService.getModelsByCategory(args.id),
  getPopularProducts: () => productsService.getPopularProducts(),
  getProductsFilters: () => productsService.getProductsFilters(),
};

const productsMutation = {
  addProduct: async (_parent, args, { user }) => {
    try {
      return await productsService.addProduct(args.product, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addProductFromConstructor: async (_, args) => {
    try {
      return await productsService.addProductFromConstructor(
        args.product,
        args.upload
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteProducts: async (_parent, args, { user }) => {
    try {
      return await productsService.deleteProducts(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateProduct: async (_parent, args, { user }) => {
    try {
      return await productsService.updateProduct(
        args.id,
        args.product,
        args.upload,
        args.primary,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteImages: async (_parent, args) => {
    try {
      return await productsService.deleteImages(args.id, args.images);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { productsQuery, productsMutation };
