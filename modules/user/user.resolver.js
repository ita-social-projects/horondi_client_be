const { AuthenticationError } = require('apollo-server');
const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args, context) => {
    console.log(context);

    return userService.getAllUsers();
  },
  getUserById: (parent, args, context) => userService.getUserById(args.id, context.req),
};
const userMutation = {
  addUser: async (parent, args) => {
    userService.addUser(args.user);
  },
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUser: (parent, args) => userService.updateUser(args.id, args.user),
};

module.exports = { userQuery, userMutation };
