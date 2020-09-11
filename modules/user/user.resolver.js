const userService = require('./user.service');
const { uploadFiles } = require('../upload/upload.service');
const {
  USER_ALREADY_CONFIRMED,
} = require('../../error-messages/user.messages');

const userQuery = {
  getAllUsers: () => userService.getAllUsers(),
  getUserByToken: (parent, args, context) => context.user,
  getUserById: (parent, args) => userService.getUser(args.id),
};
const userMutation = {
  registerUser: (parent, args) => userService.registerUser(args.user, args.language),
  loginUser: (parent, args) => userService.loginUser(args.loginInput),
  loginAdmin: (parent, args) => userService.loginAdmin(args.loginInput),
  deleteUser: (parent, args) => userService.deleteUser(args.id),
  updateUserById: async (parent, args) => {
    try {
      if (!(await args.upload)) {
        return userService.updateUserById(args.user, args.id);
      }
      const data = await args.upload;
      console.log(data);
      const uploadResult = await uploadFiles(data);
      const images = uploadResult[0].fileNames;
      if (!images) {
        return userService.updateUserById(args.user, args.id);
      }
      return userService.updateUserById({ ...args.user, images }, args.id);
    } catch ({ message }) {
      return {
        statusCode: 400,
        message,
      };
    }
  },
  confirmUserEmail: (parent, args) => userService.confirmUser(args.token),
  recoverUser: (parent, args) => userService.recoverUser(args.email, args.language),
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
  resetPassword: (parent, args) => userService.resetPassword(args.password, args.token),
  checkIfTokenIsValid: (parent, args) => userService.checkIfTokenIsValid(args.token),
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
};

module.exports = {
  userQuery,
  userMutation,
};
