const Joi = require('joi');
const { rule, and } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
const ProductModel = require('../modules/product/product.model');
const UserModel = require('../modules/user/user.model');
const {
  USER_BLOCK_PERIOD: { UNLOCKED },
} = require('../consts/user-block-period');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
  USER_IS_BLOCKED,
  INCORRECT_MIMETYPE,
  INCORRECT_FILESIZE,
} = require('../error-messages/user.messages');
const { PRODUCT_NOT_FOUND } = require('../error-messages/products.messages');
const {
  STATUS_CODES: { FORBIDDEN, UNAUTHORIZED, NOT_FOUND },
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

const checkImageType = rule()((_, args) => {
  const fileTypes = ['image/jpeg', 'image/png', 'image/webp'];
  let imagesArray = [];
  if (args.images) {
    imagesArray = [args.images];
  } else if (args.image) {
    imagesArray = args.image;
  } else if (!args.upload.length) {
    imagesArray.push(args.upload);
  } else {
    imagesArray = args.upload;
  }
  if (!imagesArray.length)
    return new RuleError(INCORRECT_MIMETYPE, BAD_REQUEST);
  for (let i = 0; i < imagesArray.length; i++) {
    let incorrectTypes = [];
    for (let j = 0; j < fileTypes.length; j++) {
      if (imagesArray[i].file.mimetype !== fileTypes[j]) {
        incorrectTypes.push(fileTypes[j]);
      }
    }
    if (incorrectTypes.length === 3) {
      return new RuleError(INCORRECT_MIMETYPE, BAD_REQUEST);
    }
  }
  return true;
});

const checkImageSize = rule()(async (_, args) => {
  let result = '';
  let imagesArray = [];
  if (args.images) {
    imagesArray = [args.images];
  } else if (args.image) {
    imagesArray = args.image;
  } else if (!args.upload.length) {
    imagesArray.push(args.upload);
  } else {
    imagesArray = args.upload;
  }
  if (!imagesArray.length) {
    return new RuleError(INCORRECT_FILESIZE, BAD_REQUEST);
  }
  let promise = new Promise((resolve, reject) => {
    for (let i = 0; i < imagesArray.length; i++) {
      result = '';
      imagesArray[i].promise.then(file => {
        let { createReadStream } = file;
        const fileStream = createReadStream();
        fileStream.on('data', chunk => {
          result += chunk;
        });
        fileStream.on('end', () => {
          if (result.length > 2000000) {
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    }
  });
  let state = await promise;
  if (!state) {
    return new RuleError(INCORRECT_FILESIZE, BAD_REQUEST);
  }
  return state;
});

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
  inputDataValidation,
  isProductToCartCorrect,
  getConstructorProductItemPresentInCart,
  checkImageType,
  checkImageSize,
};
