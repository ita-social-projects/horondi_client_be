const userService = require('./user.service');

const USER_NOT_AUTHORIZE = [
  {
    lang: 'uk',
    value: `Користувач неавторизований`,
  },
  {
    lang: 'eng',
    value: `Unauthorized`,
  },
];

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => {
    userService.getUser(context.user._id);
  },
  getUserById: (parent, args, context) => {
    if (context.user) {
      return userService.getUser(args.id);
    }
    return new Error(USER_NOT_AUTHORIZE);
  },
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user),
  loginUser: (parent, args) => userService.loginUser(args.user),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUserById: (parent, args, context) => (context.user
    ? userService.updateUserById(args.user, args.id)
    : new Error(USER_NOT_AUTHORIZE)),
  updateUserByToken: (parent, args, context) => (context.user
    ? userService.updateUserByToken(args.user, context.user)
    : new Error(USER_NOT_AUTHORIZE)),
};

module.exports = { userQuery, userMutation };
