const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => (context.user
    ? userService.getUser(context.user.userId)
    : new Error('Unauthorized')),
  getUserById: (parent, args, context) => (context.user ? userService.getUser(args.id) : new Error('Unauthorized')),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUserById: (parent, args, context) => (context.user
    ? userService.updateUser(args.user, args.id)
    : new Error('Unauthorized')),
  updateUserByToken: (parent, args, context) => (context.user
    ? userService.updateUser(args.user, context.user.userId)
    : new Error('Unauthorized')),
};

module.exports = { userQuery, userMutation };
