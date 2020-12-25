const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;

const closurePermissionsQuery = {
  getAllClosure: allow,
  getClosureById: allow,
};

const closurePermissionsMutations = {
  addClosure: hasRoles([ADMIN, SUPERADMIN]),
  updateClosure: hasRoles([ADMIN, SUPERADMIN]),
  deleteClosure: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { closurePermissionsQuery, closurePermissionsMutations };
