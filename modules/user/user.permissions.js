const { or, allow } = require('graphql-shield');

const {
  isAuthorized,
  isTheSameUser,
  hasRoles,
  inputDataValidation,
} = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const { createUserValidator } = require('../../validators/user.validator');
const {
  INPUT_FIELDS: { USER },
} = require('../../consts/input-fields');

const userPermissionsQuery = {
  getAllUsers: hasRoles([ADMIN, SUPERADMIN]),
  getUsersForStatistic: hasRoles([ADMIN, SUPERADMIN]),
  getUserByToken: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN])),
  getUserById: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  validateConfirmationToken: allow,
};
const userPermissionsMutation = {
  registerUser: inputDataValidation(USER, createUserValidator),
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
