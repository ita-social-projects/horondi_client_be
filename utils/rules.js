const Joi = require('joi');
const { rule, and } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
} = require('../error-messages/user.messages');
const {
  STATUS_CODES: { FORBIDDEN, UNAUTHORIZED },
} = require('../consts/status-codes');

const isAuthorized = rule()((parent, args, context, info) => {
  if (context.user) {
    return true;
  } else {
    return new RuleError(USER_NOT_AUTHORIZED, UNAUTHORIZED);
  }
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

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
  inputDataValidation,
};
