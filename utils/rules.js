const Joi = require('joi');
const { rule, and } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
const ProductModel = require('../modules/product/product.model');
const UserModel = require('../modules/user/user.model');
const {
  USER_BLOCK_PERIOD: { UNLOCKED },
} = require('../consts/user-block-period');
const { ITEM_ALREADY_EXISTS } = require('../error-messages/common.messages');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
  USER_IS_BLOCKED,
} = require('../error-messages/user.messages');
const { PRODUCT_NOT_FOUND } = require('../error-messages/products.messages');
const {
  STATUS_CODES: { FORBIDDEN, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST },
} = require('../consts/status-codes');

const isAuthorized = rule()((parent, args, context, info) =>
  context.user ? true : new RuleError(USER_NOT_AUTHORIZED, UNAUTHORIZED)
);

const isUnlocked = rule()((parent, args, { user }) =>
  user.banned.blockPeriod === UNLOCKED
    ? true
    : new RuleError(USER_IS_BLOCKED, FORBIDDEN)
);

const hasRoles = roles =>
  and(
    isAuthorized,
    isUnlocked,
    rule()((parent, args, context, info) =>
      roles.includes(context.user.role)
        ? true
        : new RuleError(INVALID_PERMISSIONS, FORBIDDEN)
    )
  );

const isTheSameUser = and(
  isAuthorized,
  isUnlocked,
  rule()((parent, args, context, info) =>
    `${context.user._id}` === args.id
      ? true
      : new RuleError(WRONG_CREDENTIALS, UNAUTHORIZED)
  )
);

const inputDataValidation = (data, validationSchema) =>
  rule()((_, args) => {
    const { error } = Joi.validate(args[data], validationSchema);

    return !error ? true : new RuleError(error.details[0].message, FORBIDDEN);
  });

const isProductToCartCorrect = rule()(async (_, args) => {
  const isProductExists = await ProductModel.findById(args.productId).exec();

  if (isProductExists && isProductExists.available) {
    args.product = isProductExists;
    return true;
  }
  return new RuleError(PRODUCT_NOT_FOUND, NOT_FOUND);
});

const checkIfItemExists = (data, currentModel) =>
  rule()(async (_, args) => {
    const foundItem = await currentModel
      .findOne({
        name: {
          $elemMatch: {
            $or: args[data].name.map(({ value }) => ({ value })),
          },
        },
      })
      .exec();

    if (foundItem) {
      return new RuleError(ITEM_ALREADY_EXISTS, BAD_REQUEST);
    }
    return true;
  });

const getConstructorProductItemPresentInCart = rule()(async (_, args) => {
  args.constructorData = await UserModel.findOne(
    {
      _id: args.id,
      'cart.items': {
        $elemMatch: {
          'fromConstructor.product': args.productId,
          'fromConstructor.constructorBasics':
            args.constructorData.constructorBasics,
          'fromConstructor.constructorBottom':
            args.constructorData.constructorBottom,
          'fromConstructor.constructorPattern':
            args.constructorData.constructorPattern,
          'fromConstructor.constructorFrontPocket':
            args.constructorData.constructorFrontPocket,
          'options.size': args.sizeId,
        },
      },
    },
    'cart.items.$ '
  ).exec();

  return true;
});

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
  inputDataValidation,
  isProductToCartCorrect,
  checkIfItemExists,
  getConstructorProductItemPresentInCart,
};
