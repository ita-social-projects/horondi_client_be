const { rule, and } = require('graphql-shield');
const { UserInputError } = require('apollo-server');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
} = require('../error-messages/user.messages');

const isAuthorized = rule()(async (parent, args, context, info) => {
  if (context.user) return true;
  return new UserInputError(USER_NOT_AUTHORIZED, { statusCode: 401 });
});

const isAdmin = rule()(async (parent, args, context, info) => {
  if (context.user.role === 'admin') return true;
  return new UserInputError(INVALID_PERMISSIONS, { statusCode: 403 });
});

const isTheSameUser = rule()(async (parent, args, context, info) => {
  if (context.user._id.toString() === args.id) return true;
  return new UserInputError(WRONG_CREDENTIALS, { statusCode: 401 });
});

const isAuthorizedAdmin = and(isAuthorized, isAdmin);

module.exports = {
  isAdmin,
  isAuthorized,
  isTheSameUser,
  isAuthorizedAdmin,
};
