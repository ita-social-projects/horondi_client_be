const Joi = require('joi');
const { rule, and } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
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
const {
  STATUS_CODES: { FORBIDDEN, UNAUTHORIZED, BAD_REQUEST },
} = require('../consts/status-codes');

const isAuthorized = rule()((_, __, context) =>
  context.user ? true : new RuleError(USER_NOT_AUTHORIZED, UNAUTHORIZED)
);

const isUnlocked = rule()((_, __, { user }) =>
  user.banned.blockPeriod === UNLOCKED
    ? true
    : new RuleError(USER_IS_BLOCKED, FORBIDDEN)
);

const hasRoles = (roles) =>
  and(
    isAuthorized,
    isUnlocked,
    rule()((_, __, context) =>
      roles.includes(context.user.role)
        ? true
        : new RuleError(INVALID_PERMISSIONS, FORBIDDEN)
    )
  );

const isTheSameUser = and(
  isAuthorized,
  isUnlocked,
  rule()((_, args, context) =>
    `${context.user._id}` === args.id
      ? true
      : new RuleError(WRONG_CREDENTIALS, UNAUTHORIZED)
  )
);

const inputDataValidation = (data, validationSchema) =>
  rule()((_, args) => {
    const { error } = Joi.validate(args[data], validationSchema);
    let result = true;

    if (error) {
      result = new RuleError(error.details[0].message, FORBIDDEN);
    }

    return result;
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

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
  inputDataValidation,
  checkIfItemExists,
};
