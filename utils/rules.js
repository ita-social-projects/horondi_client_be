const Joi = require('joi');
const { rule, and } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
const ProductModel = require('../modules/product/product.model');
const UserModel = require('../modules/user/user.model');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
} = require('../error-messages/user.messages');
const { PRODUCT_NOT_FOUND } = require('../error-messages/products.messages');
const {
  STATUS_CODES: { FORBIDDEN, UNAUTHORIZED, NOT_FOUND },
} = require('../consts/status-codes');

const isAuthorized = rule()((parent, args, context, info) => {
  return context.user ? true : new RuleError(USER_NOT_AUTHORIZED, UNAUTHORIZED);
});

const hasRoles = roles =>
  and(
    isAuthorized,
    rule()((parent, args, context, info) =>
      roles.includes(context.user.role)
        ? true
        : new RuleError(INVALID_PERMISSIONS, FORBIDDEN)
    )
  );

const isTheSameUser = and(
  isAuthorized,
  rule()((parent, args, context, info) =>
    `${context.user._id}` === args.id
      ? true
      : new RuleError(WRONG_CREDENTIALS, UNAUTHORIZED)
  )
);

const inputDataValidation = (data, validationSchema) =>
  rule()((_, args) => {
    const { error } = Joi.validate(args[data], validationSchema);

    if (!error) {
      return true;
    } else {
      return new RuleError(error.details[0].message, FORBIDDEN);
    }
  });

const isProductToCartCorrect = rule()(async (_, args) => {
  const isProductExists = await ProductModel.findById(args.productId).exec();

  if (isProductExists && isProductExists.available) {
    args.product = isProductExists;
    return true;
  } else {
    return new RuleError(PRODUCT_NOT_FOUND, NOT_FOUND);
  }
});

const getConstructorProductItemPresentInCart = rule()(async (_, args) => {
  args.constructorData = await UserModel.findOne(
    {
      _id: args.id,
      'cart.items.options.size': args.sizeId,
      'cart.items.fromConstructor.product': args.productId,
      'cart.items.fromConstructor.constructorBasics':
        args.constructorData.constructorBasics,
      'cart.items.fromConstructor.constructorBottom':
        args.constructorData.constructorBottom,
      'cart.items.fromConstructor.constructorPattern':
        args.constructorData.constructorPattern,
      'cart.items.fromConstructor.constructorFrontPocket':
        args.constructorData.constructorFrontPocket,
    },
    'cart.items.$ -_id'
  ).exec();

  return true;
});

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
  inputDataValidation,
  isProductToCartCorrect,
  getConstructorProductItemPresentInCart,
};
