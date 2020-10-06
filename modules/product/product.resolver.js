const productsService = require('./product.service');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');

const productsQuery = {
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
  getModelsByCategory: (parent, args) =>
    productsService.getModelsByCategory(args.id),
  getProductOptions: () => productsService.getProductOptions(),
};

const productsMutation = {
  addProduct: (parent, args) => {
    try {
      console.log(args.upload);
      return productsService.addProduct(args.product, args.upload);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteProduct: async (parent, args) => {
    const deletedProduct = await productsService.deleteProduct(args.id);
    if (deletedProduct) {
      return deletedProduct;
    }
    return {
      statusCode: 404,
      message: PRODUCT_NOT_FOUND,
    };
  },
  updateProduct: async (parent, args) => {
    try {
      return await productsService.updateProduct(
        args.id,
        args.product,
        args.upload,
        args.primary
      );
    } catch (e) {
      return {
        statusCode: e.message === PRODUCT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteImages: async (parent, args) => {
    try {
      return await productsService.deleteImages(args.id, args.images);
    } catch (e) {
      return {
        statusCode: e.message === PRODUCT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { productsQuery, productsMutation };
