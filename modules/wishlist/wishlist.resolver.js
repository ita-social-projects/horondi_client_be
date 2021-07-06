const {
  addProductItemToWishlist,
  cleanWishlist,
  getWishlistByUserId,
  addConstructorProductItemToWishlist,
  mergeWishlistFromLS,
  removeProductItemsFromWishlist,
} = require('./wishlist.service');

const RuleError = require('../../errors/rule.error');

const wishlistQuery = {
  getWishlistByUserId: async (_, { id }) => {
    try {
      return await getWishlistByUserId(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const wishlistMutation = {
  addProductItemToWishlist: async (_, { sizeId, id, product }) => {
    try {
      return await addProductItemToWishlist(sizeId, id, product);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  cleanWishlist: async (_, { id }) => {
    try {
      return await cleanWishlist(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addConstructorProductItemToWishlist: async (
    _,
    { constructorData, sizeId, id, product }
  ) => {
    try {
      return await addConstructorProductItemToWishlist(
        constructorData,
        sizeId,
        id,
        product
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  mergeWishlistFromLS: async (_, { items, id }) => {
    try {
      return await mergeWishlistFromLS(items, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  removeProductItemsFromWishlist: async (_, { items, id }) => {
    try {
      return await removeProductItemsFromWishlist(items, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { wishlistQuery, wishlistMutation };
