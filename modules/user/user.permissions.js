const { or, allow } = require('graphql-shield');

const { isAuthorized, isTheSameUser, hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const { registerUserValidation } = require('../../rules/user');

const userPermissionsQuery = {
  getAllUsers: hasRoles([ADMIN, SUPERADMIN]),
  getUsersForStatistic: hasRoles([ADMIN, SUPERADMIN]),
  getUserByToken: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN])),
  getUserById: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  validateConfirmationToken: allow,
};
const userPermissionsMutation = {
  registerUser: registerUserValidation,
  loginUser: allow,
  loginAdmin: allow,
  deleteUser: hasRoles([SUPERADMIN]),
  updateUserById: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  updateUserByToken: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN])),
  regenerateAccessToken: allow,
  confirmUser: allow,
  confirmUserEmail: allow,
  recoverUser: allow,
  switchUserStatus: hasRoles([ADMIN, SUPERADMIN]),
  resetPassword: allow,
  checkIfTokenIsValid: allow,
  sendEmailConfirmation: isAuthorized,
  registerAdmin: hasRoles([SUPERADMIN]),
  completeAdminRegister: allow,
  addProductToWishlist: isTheSameUser,
  removeProductFromWishlist: isTheSameUser,
};

module.exports = { userPermissionsMutation, userPermissionsQuery };
