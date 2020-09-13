const userService = require('./user.service');
const { uploadFiles } = require('../upload/upload.service');

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
      if (!args.upload) {
        return await userService.updateUserById(args.user, args.id);
      }
      const uploadResult = await uploadFiles([await args.upload]);
      const imageResults = await uploadResult[0];
      const images = imageResults.fileNames;
      if (!images) {
        return userService.updateUserById(args.user, args.id);
      }
      return await userService.updateUserById(
        { ...args.user, images },
        args.id,
      );
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
