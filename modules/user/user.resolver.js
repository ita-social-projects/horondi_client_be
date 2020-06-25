const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserById: (parent, args, context) => userService.getUserById(args.id, context.req),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUser: (parent, args) => userService.updateUser(args.id, args.user),
};

module.exports = { userQuery, userMutation };
