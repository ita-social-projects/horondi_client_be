const { UserInputError } = require('apollo-server');
const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => userService.getUser(context.user._id),
  getUserById: (parent, args, context) => (context.user ? userService.getUser(args.id) : new Error('Unauthorized')),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUserById: (parent, args, context) => {
    try {
      if (!context.user) {
        return new UserInputError('USER_NOT_AUTHORIZED');
      }
      return userService.updateUserById(args.user, args.id);
    } catch (e) {
      return e;
    }
  },
  updateUserByToken: (parent, args, context) => {
    try {
      if (context.user) {
        return userService.updateUserByToken(args.user, context.user);
      }
    } catch (e) {
      return e;
    }
  },
  confirmUser: (parent, args) => {
    try {
      return userService.confirmUser(args.token);
    } catch (e) {
      return e;
    }
  },
  recoverUser: (parent, args) => userService.recoverUser(args.email),
};

module.exports = { userQuery, userMutation };
