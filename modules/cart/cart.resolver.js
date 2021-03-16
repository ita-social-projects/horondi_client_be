const {
  addProductToCart,
  removeCartProductItem,
  cleanCart,
  getCartByUserId,
  updateCartItemQuantity,
  addConstructorProductItem,
} = require('./cart.service');

const RuleError = require('../../errors/rule.error');

const cartQuery = {
  getCartByUserId: (_, { id }) => {
    try {
      return getCartByUserId(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const cartMutation = {
  addProductToCart: (_, { sizeId, id, product }) => {
    try {
      return addProductToCart(sizeId, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  removeCartProductItem: (_, { id, product }) => {
    try {
      return removeCartProductItem(id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  cleanCart: (_, { id }) => {
    try {
      return cleanCart(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateCartItemQuantity: (_, { quantity, id, product }) => {
    try {
      return updateCartItemQuantity(quantity, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addConstructorProductItem(_, { constructorData, id, product }) {
    try {
      return addConstructorProductItem(constructorData, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { cartQuery, cartMutation };
