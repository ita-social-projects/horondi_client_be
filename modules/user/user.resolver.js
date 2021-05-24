const userService = require('./user.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const userQuery = {
  getAllUsers: async (parent, args) => {
    try {
      return await userService.getAllUsers(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getUsersForStatistic: async (parent, args, context) => {
    try {
      return await userService.getUsersForStatistic(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getUserByToken: async (parent, args, context) => {
    try {
      return await context.user;
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getUserById: async (parent, args) => {
    try {
      return await userService.getUser(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  validateConfirmationToken: async (parent, args) => {
    try {
      return await userService.validateConfirmationToken(args.token);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPurchasedProducts: async (parent, args) => {
    try {
      return await userService.getPurchasedProducts(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
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
  googleUser: (parent, args) =>
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
      return await userService.googleUser(args.idToken, args.staySignedIn);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  loginUser: async (parent, args) => {
    try {
      return await userService.loginUser(args.loginInput);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  loginAdmin: async (parent, args) => {
    try {
      return await userService.loginAdmin(args.loginInput);
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
  updateUserById: async (parent, args, context) => {
    try {
      return await userService.updateUserById(
        args.user,
        context.user,
        args.upload
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  regenerateAccessToken: async (parent, args) => {
    try {
      return await userService.regenerateAccessToken(args.refreshToken);
    } catch (err) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  confirmUserEmail: async (parent, args) => {
    try {
      return await userService.confirmUser(args.token);
    } catch (e) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  recoverUser: async (parent, args) => {
    try {
      return await userService.recoverUser(args.email, args.language);
    } catch (e) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  switchUserStatus: async (parent, args) => {
    try {
      return await userService.switchUserStatus(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  resetPassword: async (parent, args) => {
    try {
      return await userService.resetPassword(args.password, args.token);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  checkIfTokenIsValid: async (parent, args) => {
    try {
      return await userService.checkIfTokenIsValid(args.token);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
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
  addProductToWishlist: async (parent, args, context) => {
    try {
      return await userService.addProductToWishlist(
        args.productId,
        args.key,
        context.user
      );
    } catch (e) {
      return new RuleError(err.message, err.statusCode);
    }
  },
  removeProductFromWishlist: async (parent, args, context) => {
    try {
      return await userService.removeProductFromWishlist(
        args.productId,
        args.key,
        context.user
      );
    } catch (e) {
      return new RuleError(err.message, err.statusCode);
    }
  },
};

module.exports = {
  userQuery,
  userMutation,
};
