const userService = require('./user.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

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
        statusCode: BAD_REQUEST,
        message: err.message,
      };
    }
  },
  getPurchasedProducts: (parent, args) =>
    userService.getPurchasedProducts(args.id),
};
const userMutation = {
  registerUser: async (parent, args) => {
    try {
      return await userService.registerUser(args.user, args.language);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  googleUser: (parent, args) =>
    userService.googleUser(args.idToken, args.staySignedIn),
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
  updateUserById: (parent, args, context) =>
    userService.updateUserById(args.user, context.user, args.upload),
  regenerateAccessToken: async (parent, args) => {
    try {
      return await userService.regenerateAccessToken(args.refreshToken);
    } catch (err) {
      return {
        statusCode: err.statusCode,
        message: err.message,
      };
    }
  },
  confirmUserEmail: (parent, args) => userService.confirmUser(args.token),
  recoverUser: (parent, args) =>
    userService.recoverUser(args.email, args.language),
  switchUserStatus: async (parent, args) => {
    try {
      return await userService.switchUserStatus(args.id);
    } catch (err) {
      return {
        statusCode: BAD_REQUEST,
        message: err.message,
      };
    }
  },
  resetPassword: (parent, args) =>
    userService.resetPassword(args.password, args.token),
  checkIfTokenIsValid: (parent, args) =>
    userService.checkIfTokenIsValid(args.token),
  sendEmailConfirmation: async (parent, args) => {
    try {
      return await userService.sendConfirmationLetter(
        args.email,
        args.language
      );
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
  registerAdmin: async (parent, args) => {
    try {
      return await userService.registerAdmin(args.user);
    } catch (err) {
      return {
        statusCode: BAD_REQUEST,
        message: err.message,
      };
    }
  },
  completeAdminRegister: async (parent, args) => {
    try {
      return await userService.completeAdminRegister(args.user, args.token);
    } catch (err) {
      return {
        statusCode: BAD_REQUEST,
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
};

module.exports = {
  userQuery,
  userMutation,
};
