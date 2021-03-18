const {
  addProductToCart,
  removeCartProductItem,
  cleanCart,
  getCartByUserId,
  updateCartItemQuantity,
  addConstructorProductItem,
  removeConstructorProductItemFromCart,
  updateConstructorProductItemQuantity,
  mergeCartFromLS,
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
  removeCartProductItem: (_, { sizeId, id, product }) => {
    try {
      return removeCartProductItem(sizeId, id, product);
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
  updateCartItemQuantity: (_, { quantity, sizeId, id, product }) => {
    try {
      return updateCartItemQuantity(quantity, sizeId, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addConstructorProductItem(_, { constructorData, sizeId, id, product }) {
    try {
      return addConstructorProductItem(constructorData, sizeId, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  removeConstructorProductItemFromCart(
    _,
    { productId, sizeId, constructorData, id }
  ) {
    try {
      return removeConstructorProductItemFromCart(
        productId,
        sizeId,
        constructorData,
        id
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateConstructorProductItemQuantity(
    _,
    { quantity, productId, sizeId, constructorData, id }
  ) {
    try {
      return updateConstructorProductItemQuantity(
        quantity,
        productId,
        sizeId,
        constructorData,
        id
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  mergeCartFromLS(_, { items, id }) {
    try {
      return mergeCartFromLS(items, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { cartQuery, cartMutation };
