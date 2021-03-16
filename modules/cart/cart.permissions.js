const { and } = require('graphql-shield');

const {
  updateCartQuantityValidator,
} = require('../../validators/cart.validator');
const {
  isProductToCartCorrect,
  isTheSameUser,
  inputDataValidation,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { QUANTITY },
} = require('../../consts/input-fields');

const cartPermissionsQuery = {
  getCartByUserId: isTheSameUser,
};

const cartPermissionsMutations = {
  addProductToCart: and(isTheSameUser, isProductToCartCorrect),
  removeCartProductItem: and(isTheSameUser, isProductToCartCorrect),
  updateCartItemQuantity: and(
    inputDataValidation(QUANTITY, updateCartQuantityValidator),
    isTheSameUser,
    isProductToCartCorrect
  ),
  cleanCart: isTheSameUser,
};
module.exports = { cartPermissionsQuery, cartPermissionsMutations };
