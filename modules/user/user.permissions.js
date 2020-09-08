const { or } = require('graphql-shield');
const {
  isAuthorized,
  isNotAuthorized,
  isTheSameUser,
  hasRoles
} = require('../../utils/rules');
const {roles} = require('../../consts');

const {ADMIN,SUPERADMIN} = roles;

const userPermissionsQuery = {
  getAllUsers: hasRoles([ADMIN,SUPERADMIN]),
  getUserByToken: or(isAuthorized, hasRoles([ADMIN,SUPERADMIN])),
  getUserById: or(isTheSameUser,hasRoles([ADMIN,SUPERADMIN])),
};
const userPermissionsMutation = {
  registerUser: isNotAuthorized,
  loginUser: isNotAuthorized,
  loginAdmin: isNotAuthorized,
  deleteUser: hasRoles([ADMIN,SUPERADMIN]),
  updateUserById: or(isTheSameUser, hasRoles([ADMIN,SUPERADMIN])),
  updateUserByToken: or(isAuthorized, hasRoles([ADMIN,SUPERADMIN])),
  confirmUser: isNotAuthorized,
  recoverUser: isNotAuthorized,
  switchUserStatus: hasRoles([ADMIN,SUPERADMIN]),
  resetPassword: isNotAuthorized,
  checkIfTokenIsValid: isNotAuthorized,
  registerAdmin: hasRoles([SUPERADMIN])
};

module.exports = { userPermissionsMutation, userPermissionsQuery };
