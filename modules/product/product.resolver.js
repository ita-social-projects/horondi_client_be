const productsService = require('./product.service');
const { PRODUCT_NOT_FOUND, MODEL_NOT_FOUND } = require('../../error-messages/products.messages');

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
  getModelsByCategory: async (parent, args) => {
      const models = await productsService.getModelsByCategory(args.id)
      if (models) {
        return models;
      }
      return {
        statusCode: 404,
        message: MODEL_NOT_FOUND,
      };
  }
  
  
};

const productsMutation = {
  addProduct: async (parent, args) => {
    try {
      return await productsService.addProduct(args.product);
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
      return await productsService.updateProduct(args.id, args.product);
    } catch (e) {
      return {
        statusCode: e.message === PRODUCT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { productsQuery, productsMutation };
