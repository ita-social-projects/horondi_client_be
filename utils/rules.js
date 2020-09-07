const { rule } = require('graphql-shield');
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

const hasRoles = (roles) => rule()(async (parent, args, context, info) => {
  return (context.user && roles.includes(context.user.role)) 
  ? true
  : new UserInputError(INVALID_PERMISSIONS, { statusCode: 403 });
});

const isTheSameUser = rule()(async (parent, args, context, info) => {
  if (`${context.user._id}` === args.id) return true;
  return new UserInputError(WRONG_CREDENTIALS, { statusCode: 401 });
});

module.exports = {
  hasRoles, isAuthorized, isTheSameUser
};
