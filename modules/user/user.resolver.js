const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserById: (parent, args, context) => userService.getUserById(args.id, context.user),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUser: (parent, args, context) => userService.updateUser(args.id, args.user, context.user),
};

module.exports = { userQuery, userMutation };
