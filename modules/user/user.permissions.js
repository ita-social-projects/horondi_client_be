const { or, allow, and } = require('graphql-shield');

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
  emailUserValidator,
  resetPasswordValidator,
  completeAdminRegisterValidator,
  registerAdminValidator,
  updateUserValidator,
} = require('../../validators/user.validator');
const {
  INPUT_FIELDS: { USER, LOGIN_INPUT, EMAIL, PASSWORD },
} = require('../../consts/input-fields');

const userPermissionsQuery = {
  getAllUsers: hasRoles([ADMIN, SUPERADMIN]),
  getCountUserOrders: hasRoles([ADMIN, SUPERADMIN, USER]),
  getUsersForStatistic: hasRoles([ADMIN, SUPERADMIN]),
  getUserByToken: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN])),
  getUserById: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  validateConfirmationToken: allow,
};
const userPermissionsMutation = {
  blockUser: hasRoles([SUPERADMIN, ADMIN]),
  unlockUser: hasRoles([SUPERADMIN, ADMIN]),
  registerUser: inputDataValidation(USER, createUserValidator),
  loginUser: inputDataValidation(LOGIN_INPUT, loginUserValidator),
  loginAdmin: inputDataValidation(LOGIN_INPUT, loginUserValidator),
  deleteUser: hasRoles([SUPERADMIN]),
  updateUserById: and(
    inputDataValidation(USER, updateUserValidator),
    or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN]))
  ),
  regenerateAccessToken: allow,
  confirmUser: allow,
  confirmUserEmail: allow,
  recoverUser: inputDataValidation(EMAIL, emailUserValidator),
  switchUserStatus: hasRoles([ADMIN, SUPERADMIN]),
  resetPassword: inputDataValidation(PASSWORD, resetPasswordValidator),
  checkIfTokenIsValid: allow,
  sendEmailConfirmation: and(
    inputDataValidation(EMAIL, emailUserValidator),
    isAuthorized
  ),
  registerAdmin: and(
    inputDataValidation(USER, registerAdminValidator),
    hasRoles([SUPERADMIN])
  ),
  completeAdminRegister: inputDataValidation(
    USER,
    completeAdminRegisterValidator
  ),
  addProductToWishlist: isTheSameUser,
  removeProductFromWishlist: isTheSameUser,
};

module.exports = { userPermissionsMutation, userPermissionsQuery };
