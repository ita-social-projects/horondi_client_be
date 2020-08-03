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
  addProduct: (parent, args) => productsService.addProduct(args.products),
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
  updateProduct: (parent, args) => productsService.updateProduct(args.id, args.products),
};

module.exports = { productsQuery, productsMutation };
