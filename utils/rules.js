const { rule } = require('graphql-shield');
const { UserInputError } = require('apollo-server');
const {
  INVALID_PERMISSIONS,
  USER_NOT_AUTHORIZED,
  WRONG_CREDENTIALS,
  USER_ALREADY_AUTHORIZED
} = require('../error-messages/user.messages');

const isAuthorized = rule()((parent, args, context, info) => {
  return (context.user) ? true : new UserInputError(USER_NOT_AUTHORIZED, { statusCode: 401 })
});

const isNotAuthorized = rule()((parent, args, context, info) => {
  return (context.user) ? new UserInputError(USER_ALREADY_AUTHORIZED, { statusCode: 400 }) : true
});

const hasRoles = (roles) => rule()(
  (parent, args, context, info) => {
  return ((context.user && roles.includes(context.user.role))
  ? true
  : new UserInputError(INVALID_PERMISSIONS, { statusCode: 403 }));
});

const isTheSameUser = rule()((parent, args, context, info) => {
  return ((`${context.user._id}` === args.id)
  ? true
  : new UserInputError(WRONG_CREDENTIALS, { statusCode: 401 }));
});

module.exports = {
  hasRoles, isAuthorized, isTheSameUser,isNotAuthorized
};
