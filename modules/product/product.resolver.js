const productsService = require('./product.service');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const productsQuery = {
  getProductById: async (parent, args) => {
    const product = await productsService.getProductById(args.id);
    if (product) {
      return product;
    }
    return new RuleError(PRODUCT_NOT_FOUND, NOT_FOUND);
  },
  getProducts: async (parent, args) => {
    try {
      return await productsService.getProducts(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getModelsByCategory: (parent, args) =>
    productsService.getModelsByCategory(args.id),
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
    const deletedProduct = await productsService.deleteProduct(args.id, user);
    if (deletedProduct) {
      return deletedProduct;
    }
    return new RuleError(e.message, e.statusCode);
  },
  updateProduct: async (parent, args, { user }) => {
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
  deleteImages: async (parent, args) => {
    try {
      return await productsService.deleteImages(args.id, args.images);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { productsQuery, productsMutation };
