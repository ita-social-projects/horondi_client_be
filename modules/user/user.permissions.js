const { or } = require('graphql-shield');
const {
  isAuthorized,
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
const userPermissionsMutations = {
  registerUser: !isAuthorized,
  loginUser: !isAuthorized,
  loginAdmin: !isAuthorized,
  deleteUser: hasRoles([ADMIN,SUPERADMIN]),
  updateUserById: or(isTheSameUser, hasRoles([ADMIN,SUPERADMIN])),
  updateUserByToken: or(isAuthorized, hasRoles([ADMIN,SUPERADMIN])),
  confirmUser: !isAuthorized,
  recoverUser: !isAuthorized,
  switchUserStatus: hasRoles([ADMIN,SUPERADMIN]),
  resetPassword: !isAuthorized,
  checkIfTokenIsValid: !isAuthorized,
  registerAdmin: hasRoles([SUPERADMIN])
};

module.exports = { userPermissionsMutations, userPermissionsQuery };
