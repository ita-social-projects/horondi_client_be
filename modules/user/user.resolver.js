const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => (context.user
    ? userService.getUserById(context.user)
    : new Error('Unauthorized')),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUser: (parent, args, context) => (context.user
    ? userService.updateUser(args.user, context.user)
    : new Error('Unauthorized')),
};

module.exports = { userQuery, userMutation };
