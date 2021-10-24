const { allow, and } = require('graphql-shield');

const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { WISHLIST },
} = require('../../consts/input-fields');
const wishlistInputValidator = require('../../validators/wishlist.validator');

const wishlistPermissionsQuery = {
  getWishlistByUserId: allow,
};

const wishlistPermissionsMutations = {
  addProductToWishlist: and(
    inputDataValidation(WISHLIST, wishlistInputValidator)
  ),
  deleteProductFromWishlist: allow,
};

module.exports = {
  wishlistPermissionsMutations,
  wishlistPermissionsQuery,
};
