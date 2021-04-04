const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const strapPermissionsQuery = {
  getAllStraps: allow,
  getStrapById: allow,
  getStrapsByModel: allow,
};

const strapPermissionsMutations = {
  addStrap: hasRoles([ADMIN, SUPERADMIN]),
  updateStrap: hasRoles([ADMIN, SUPERADMIN]),
  deleteStrap: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  strapPermissionsQuery,
  strapPermissionsMutations,
};
