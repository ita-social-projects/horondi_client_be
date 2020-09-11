const { or, allow } = require('graphql-shield');
const {
  isAuthorized,
  isTheSameUser,
  isAuthorizedAdmin,
} = require('../../utils/rules');

const userPermissionsQuery = {
  getAllUsers: isAuthorizedAdmin,
  getUserByToken: allow,
  getUserById: or(isAuthorizedAdmin, isTheSameUser),
};
const userPermissionsMutations = {
  registerUser: allow,
  loginUser: allow,
  loginAdmin: allow,
  deleteUser: isAuthorizedAdmin,
  updateUserById: or(isTheSameUser, isAuthorizedAdmin),
  confirmUserEmail: allow,
  recoverUser: allow,
  switchUserStatus: isAuthorizedAdmin,
  resetPassword: allow,
  checkIfTokenIsValid: allow,
  sendEmailConfirmation: isAuthorized,
};

module.exports = { userPermissionsMutations, userPermissionsQuery };
