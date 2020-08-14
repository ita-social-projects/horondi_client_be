const { UserInputError } = require('apollo-server');
const userService = require('./user.service');
const { USER_NOT_AUTHORIZED } = require('../../error-messages/user.messages');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => userService.getUser(context.user._id),
  getUserById: (parent, args, context) => (context.user
    ? userService.getUser(args.id)
    : new UserInputError(USER_NOT_AUTHORIZED)),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user, args.language),
  loginUser: (parent, args) => userService.loginUser(args.loginInput),
  loginAdmin: (parent, args) => userService.loginAdmin(args.loginInput),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUserById: (parent, args, context) => (context.user
    ? userService.updateUserById(args.user, args.id)
    : new UserInputError(USER_NOT_AUTHORIZED)),
  updateUserByToken: (parent, args, context) => (context.user
    ? userService.updateUserByToken(args.user, context.user)
    : new UserInputError(USER_NOT_AUTHORIZED)),
  confirmUser: (parent, args) => userService.confirmUser(args.token),
  recoverUser: (parent, args) => userService.recoverUser(args.email, args.language),
  handleUserStatus: (parent, args) => userService.handleUserStatus(args.id),
};

module.exports = {
  userQuery,
  userMutation,
};
