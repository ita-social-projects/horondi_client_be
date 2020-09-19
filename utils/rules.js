const { rule, and } = require('graphql-shield');
const RuleError = require('../errors/rule.error');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
} = require('../error-messages/user.messages');

const isAuthorized = rule()((parent, args, context, info) =>
  context.user ? true : new RuleError(USER_NOT_AUTHORIZED, 401)
);

const hasRoles = roles =>
  and(
    isAuthorized,
    rule()((parent, args, context, info) =>
      roles.includes(context.user.role)
        ? true
        : new RuleError(INVALID_PERMISSIONS, 403)
    )
  );

const isTheSameUser = and(
  isAuthorized,
  rule()((parent, args, context, info) =>
    `${context.user._id}` === args.id
      ? true
      : new RuleError(WRONG_CREDENTIALS, 401)
  )
);

module.exports = {
  hasRoles,
  isAuthorized,
  isTheSameUser,
};
