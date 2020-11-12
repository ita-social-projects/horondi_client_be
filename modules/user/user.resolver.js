const userService = require('./user.service');

const userQuery = {
  getAllUsers: (parent, args) => userService.getAllUsers(args),
  getUsersForStatistic: (parent, args, context) =>
    userService.getUsersForStatistic(args),
  getUserByToken: (parent, args, context) => context.user,
  getUserById: (parent, args) => userService.getUser(args.id),
  validateConfirmationToken: (parent, args) => {
    try {
      return userService.validateConfirmationToken(args.token);
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message,
      };
    }
  },
};
const userMutation = {
  registerUser: (parent, args) =>
    userService.registerUser(args.user, args.language),
  loginUser: (parent, args) => userService.loginUser(args.loginInput),
  loginAdmin: (parent, args) => userService.loginAdmin(args.loginInput),
  deleteUser: async (parent, args) => {
    try {
      return await userService.deleteUser(args.id);
    } catch (err) {
      return {
        statusCode: err.statusCode,
        message: err.message,
      };
    }
  },
  updateUserById: (parent, args) =>
    userService.updateUserById(args.user, args.id, args.upload),
  confirmUserEmail: (parent, args) => userService.confirmUser(args.token),
  recoverUser: (parent, args) =>
    userService.recoverUser(args.email, args.language),
  switchUserStatus: async (parent, args) => {
    try {
      return await userService.switchUserStatus(args.id);
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message,
      };
    }
  },
  resetPassword: (parent, args) =>
    userService.resetPassword(args.password, args.token),
  checkIfTokenIsValid: (parent, args) =>
    userService.checkIfTokenIsValid(args.token),
  sendEmailConfirmation: (parent, args) => {
    try {
      return userService.sendConfirmationLetter(args.email, args.language);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  registerAdmin: async (parent, args) => {
    try {
      return await userService.registerAdmin(args.user);
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message,
      };
    }
  },
  completeAdminRegister: async (parent, args) => {
    try {
      return await userService.completeAdminRegister(args.user, args.token);
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message,
      };
    }
  },
  addProductToWishlist: (parent, args, context) =>
    userService.addProductToWishlist(args.productId, args.key, context.user),
  removeProductFromWishlist: (parent, args, context) =>
    userService.removeProductFromWishlist(
      args.productId,
      args.key,
      context.user
    ),

  addProductToCart: (parent, args, context) =>
    userService.addProductToCart(args.product, args.key, context.user),
  removeProductFromCart: (parent, args, context) =>
    userService.removeProductFromCart(args.product, args.key, context.user),
  changeCartProductQuantity: (parent, args, context) =>
    userService.changeCartProductQuantity(args.product, args.key, context.user),
};

module.exports = {
  userQuery,
  userMutation,
};
