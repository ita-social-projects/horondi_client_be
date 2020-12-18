const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const colorPermissionsQuery = {
  getAllColors: allow,
  getColorById: allow,
};
const colorPermissionsMutations = {
  addColor: hasRoles([ADMIN, SUPERADMIN]),
  updateColor: hasRoles([ADMIN, SUPERADMIN]),
  deleteColor: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  colorPermissionsQuery,
  colorPermissionsMutations,
};
