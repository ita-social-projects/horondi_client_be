const productsService = require('./product.service');
const {
  PRODUCT_NOT_FOUND,
  PRODUCTS_NOT_FOUND,
} = require('../../error-messages/products.messages');

const productsQuery = {
  getProducts: async (parent, args) => {
    const products = await productsService.getProducts(args);
    if (products.length > 0) {
      return products;
    }
    return [
      {
        statusCode: 404,
        message: PRODUCTS_NOT_FOUND,
      },
    ];
  },
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
};

const productsMutation = {
  addProduct: async (parent, args) => {
    console.log(args);
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
    const product = await productsService.getProductById(args.id);
    if (product) {
      return productsService.updateProduct(args.id, args.product);
    }
    return {
      statusCode: 404,
      message: PRODUCT_NOT_FOUND,
    };
  },
};

module.exports = { productsQuery, productsMutation };
