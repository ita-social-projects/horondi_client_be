const { and } = require('graphql-shield');

const {
  updateCartQuantityValidator,
} = require('../../validators/cart.validator');
const {
  isProductToCartCorrect,
  isTheSameUser,
  inputDataValidation,
  getConstructorProductItemPresentInCart,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { QUANTITY },
} = require('../../consts/input-fields');

const cartPermissionsQuery = {
  getCartByUserId: isTheSameUser,
};

const cartPermissionsMutations = {
  addProductToCart: and(isTheSameUser, isProductToCartCorrect),
  updateCartItemQuantity: and(
    inputDataValidation(QUANTITY, updateCartQuantityValidator),
    isTheSameUser,
    isProductToCartCorrect,
  ),
  cleanCart: isTheSameUser,
  addConstructorProductItemToCart: and(isTheSameUser, isProductToCartCorrect),
  updateCartConstructorProductItemQuantity: and(
    inputDataValidation(QUANTITY, updateCartQuantityValidator),
    isTheSameUser,
    getConstructorProductItemPresentInCart,
  ),
  mergeCartFromLS: isTheSameUser,
  removeProductItemsFromCart: isTheSameUser,
};
module.exports = { cartPermissionsQuery, cartPermissionsMutations };
