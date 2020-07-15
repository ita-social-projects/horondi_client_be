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
  updateUserById: (parent, args, context) => (context.user
    ? userService.updateUserById(args.user, args.id)
    : new Error('Unauthorized')),
  updateUserByToken: (parent, args, context) => (context.user
    ? userService.updateUserByToken(args.user, context.user)
    : new Error('Unauthorized')),
};

module.exports = { userQuery, userMutation };
