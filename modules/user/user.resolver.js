const userService = require('./user.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const userQuery = {
  getAllUsers: (_parent, args) => userService.getAllUsers(args),
  getUsersForStatistic: (_parent, args) =>
    userService.getUsersForStatistic(args),
  getUserByToken: (_parent, _args, context) => context.user,
  getUserById: (_parent, args) => userService.getUser(args.id),
  validateConfirmationToken: (_parent, args) => {
    try {
      return userService.validateConfirmationToken(args.token);
    } catch (err) {
      return {
        statusCode: BAD_REQUEST,
        message: err.message,
      };
    }
  },
  getPurchasedProducts: (_parent, { id }) =>
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
  registerUser: async (_parent, args) => {
    try {
      return await userService.registerUser(args.user, args.language);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  googleUser: (_, args) =>
    userService.googleUser(args.idToken, args.rememberMe),
  facebookUser: (_, args) =>
    userService.facebookUser(args.idToken, args.rememberMe),
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
  deleteUser: async (_parent, args) => {
    try {
      return await userService.deleteUser(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateUserById: (_parent, args, context) =>
    userService.updateUserById(
      args.user,
      context.user,
      args.image,
      args.id,
      args.deleteAvatar
    ),
  regenerateAccessToken: async (_parent, args) => {
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
  recoverUser: (_parent, args) =>
    userService.recoverUser(args.email, args.language),
  switchUserStatus: async (_parent, args) => {
    try {
      return await userService.switchUserStatus(args.id);
    } catch (err) {
      return {
        statusCode: BAD_REQUEST,
        message: err.message,
      };
    }
  },
  resetPassword: (_parent, args) =>
    userService.resetPassword(args.password, args.token),
  checkIfTokenIsValid: (_parent, args) =>
    userService.checkIfTokenIsValid(args.token),
  sendEmailConfirmation: async (_parent, args) => {
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
};

module.exports = {
  userQuery,
  userMutation,
};
