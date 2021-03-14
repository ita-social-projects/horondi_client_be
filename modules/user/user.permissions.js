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
const {
  createUserValidator,
  loginUserValidator,
  recoverUserValidator,
  resetPasswordValidator,
  completeAdminRegisterValidator,
} = require('../../validators/user.validator');
const {
  INPUT_FIELDS: { USER, LOGIN_INPUT, EMAIL, PASSWORD },
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
  loginUser: inputDataValidation(LOGIN_INPUT, loginUserValidator),
  loginAdmin: inputDataValidation(LOGIN_INPUT, loginUserValidator),
  deleteUser: hasRoles([SUPERADMIN]),
  updateUserById: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  updateUserByToken: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN])),
  regenerateAccessToken: allow,
  confirmUser: allow,
  confirmUserEmail: allow,
  recoverUser: inputDataValidation(EMAIL, recoverUserValidator),
  switchUserStatus: hasRoles([ADMIN, SUPERADMIN]),
  resetPassword: inputDataValidation(PASSWORD, resetPasswordValidator),
  checkIfTokenIsValid: allow,
  sendEmailConfirmation: isAuthorized,
  registerAdmin: hasRoles([SUPERADMIN]),
  completeAdminRegister: inputDataValidation(
    USER,
    completeAdminRegisterValidator
  ),
  addProductToWishlist: isTheSameUser,
  removeProductFromWishlist: isTheSameUser,
};

module.exports = { userPermissionsMutation, userPermissionsQuery };
