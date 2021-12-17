const {
  addProductToCart,
  cleanCart,
  getCartByUserId,
  updateCartItemQuantity,
  addConstructorProductItemToCart,
  updateCartConstructorProductItemQuantity,
  mergeCartFromLS,
  removeProductItemsFromCart,
  changeCartItemSize,
} = require('./cart.service');

const RuleError = require('../../errors/rule.error');

const cartQuery = {
  getCartByUserId: async (_, { id }) => {
    try {
      return await getCartByUserId(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const cartMutation = {
  addProductToCart: async (_, {
    allSizes, sizeId, id, product, price,
  }) => {
    try {
      return await addProductToCart(allSizes, sizeId, id, product, price);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  cleanCart: async (_, { id }) => {
    try {
      return await cleanCart(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateCartItemQuantity: async (_, {
    quantity, sizeId, id, product,
  }) => {
    try {
      return await updateCartItemQuantity(quantity, sizeId, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addConstructorProductItemToCart: async (
    _,
    {
      constructorData, sizeId, id, product,
    },
  ) => {
    try {
      return await addConstructorProductItemToCart(
        constructorData,
        sizeId,
        id,
        product,
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateCartConstructorProductItemQuantity: async (
    _,
    { quantity, constructorData, id },
  ) => {
    try {
      return await updateCartConstructorProductItemQuantity(
        quantity,
        constructorData,
        id,
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  mergeCartFromLS: async (_, { items, id }) => {
    try {
      return await mergeCartFromLS(items, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  removeProductItemsFromCart: async (_, { items, id }) => {
    try {
      return await removeProductItemsFromCart(items, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  changeCartItemSize: async (_, {
    id, itemId, size, price, quantity,
  }) => {
    try {
      return await changeCartItemSize(id, itemId, size, price, quantity);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { cartQuery, cartMutation };
