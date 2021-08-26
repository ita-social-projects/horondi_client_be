const userService = require('./user.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const userQuery = {
  getCountUserOrders: async (_, args, { user }) => {
    try {
      return await userService.getCountUserOrders(user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
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
  getPurchasedProducts: (parent, { id }) =>
    userService.getPurchasedProducts(id),
};
const userMutation = {
  blockUser: async (_, { userId }, { user }) => {
    try {
      return await userService.blockUser(userId, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  unlockUser: async (_, { userId }, { user }) => {
    try {
      return await userService.unlockUser(userId, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  registerUser: async (parent, args) => {
    try {
      return await userService.registerUser(args.user, args.language);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  googleUser: (_, args) =>
    userService.googleUser(args.idToken, args.staySignedIn),
  loginUser: async (_, { loginInput }) => {
    try {
      return await userService.loginUser(loginInput);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  loginAdmin: async (_, { loginInput }) => {
    try {
      return await userService.loginAdmin(loginInput);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteUser: async (parent, args) => {
    try {
      return await userService.deleteUser(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateUserById: (parent, args, context) =>
    userService.updateUserById(args.user, context.user, args.upload),
  regenerateAccessToken: async (parent, args) => {
    try {
      return await userService.regenerateAccessToken(args.refreshToken);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  confirmUserEmail: async (_, { token }) => {
    try {
      return await userService.confirmUser(token);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
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
      return new RuleError(e.message, e.statusCode);
    }
  },
  registerAdmin: async (_, { user }, { user: admin }) => {
    try {
      return await userService.registerAdmin(user, admin);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  resendEmailToConfirmAdmin: async (_, { user }) => {
    try {
      return await userService.resendEmailToConfirmAdmin(user);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  confirmSuperadminCreation: async (_, { user }) => {
    try {
      return await userService.confirmSuperadminCreation(user);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  completeAdminRegister: async (_, { user, token }) => {
    try {
      return await userService.completeAdminRegister(user, token);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
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
