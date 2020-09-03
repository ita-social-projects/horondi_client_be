const { or, allow } = require('graphql-shield');
const {
  isAuthorized,
  isTheSameUser,
  isAuthorizedAdmin,
} = require('../../utils/rules');

const userPermissionsQuery = {
  getAllUsers: isAuthorizedAdmin,
  getUserByToken: or(isAuthorizedAdmin, isAuthorized),
  getUserById: or(isAuthorizedAdmin, isTheSameUser),
};
const userPermissionsMutations = {
  registerUser: allow,
  loginUser: allow,
  loginAdmin: allow,
  deleteUser: isAuthorizedAdmin,
  updateUserById: or(isTheSameUser, isAuthorizedAdmin),
  updateUserByToken: or(isAuthorized, isAuthorizedAdmin),
  confirmUser: allow,
  recoverUser: allow,
  switchUserStatus: isAuthorizedAdmin,
  resetPassword: allow,
  checkIfTokenIsValid: allow,
};

module.exports = { userPermissionsMutations, userPermissionsQuery };
