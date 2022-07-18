const {
  getWishlistByUserId,
  addProductToWishlist,
  deleteProductFromWishlist,
} = require('./wishlist.service');

const RuleError = require('../../errors/rule.error');

const wishlistQuery = {
  getWishlistByUserId: async (_, _params, { user }) => {
    try {
      return await getWishlistByUserId(user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const wishlistMutation = {
  addProductToWishlist: async (_, { productId }, { user }) => {
    try {
      return await addProductToWishlist(productId, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteProductFromWishlist: async (_, { productId }, { user }) => {
    try {
      return await deleteProductFromWishlist(productId, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { wishlistQuery, wishlistMutation };
