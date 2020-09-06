const { or } = require('graphql-shield');
const {
  isAuthorized,
  isTheSameUser,
  hasRoles
} = require('../../utils/rules');

const userPermissionsQuery = {
  getAllUsers: hasRoles(['admin','superadmin']),
  getUserByToken: or(isAuthorized, hasRoles(['admin','superadmin'])),
  getUserById: or(isTheSameUser,hasRoles(['admin','superadmin'])),
};
const userPermissionsMutations = {
  registerUser: !isAuthorized,
  loginUser: !isAuthorized,
  loginAdmin: !isAuthorized,
  deleteUser: hasRoles(['admin','superadmin']),
  updateUserById: or(isTheSameUser, hasRoles(['admin','superadmin'])),
  updateUserByToken: or(isAuthorized, hasRoles(['admin','superadmin'])),
  confirmUser: !isAuthorized,
  recoverUser: !isAuthorized,
  switchUserStatus: hasRoles(['admin','superadmin']),
  resetPassword: !isAuthorized,
  checkIfTokenIsValid: !isAuthorized,
  registerSpecialUser: hasRoles(['superadmin'])
};

module.exports = { userPermissionsMutations, userPermissionsQuery };
