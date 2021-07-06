const { and } = require('graphql-shield');

const {
  isProductToWishlistCorrect,
  isTheSameUser,
} = require('../../utils/rules');

const wishlistPermissionsQuery = {
  getWishlistByUserId: isTheSameUser,
};

const wishlistPermissionsMutations = {
  addProductItemToWishlist: and(isTheSameUser, isProductToWishlistCorrect),
  cleanWishlist: isTheSameUser,
  addConstructorProductItemToWishlist: and(
    isTheSameUser,
    isProductToWishlistCorrect
  ),
  mergeWishlistFromLS: isTheSameUser,
  removeProductItemsFromWishlist: isTheSameUser,
};
module.exports = { wishlistPermissionsQuery, wishlistPermissionsMutations };
