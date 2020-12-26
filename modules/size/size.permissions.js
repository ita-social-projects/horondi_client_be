const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const sizePermissionsQuery = {
  getAllSizes: allow,
  getSizeById: allow,
};
const sizePermissionsMutations = {
  addSize: hasRoles([ADMIN, SUPERADMIN]),
  deleteSize: hasRoles([ADMIN, SUPERADMIN]),
  updateSize: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  sizePermissionsMutations,
  sizePermissionsQuery,
};
