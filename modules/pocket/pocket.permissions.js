const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const pocketPermissionsQuery = {
  getAllPockets: allow,
  getPocketById: allow,
  getPocketsByModel: allow,
};

const pocketPermissionsMutations = {
  addPocket: hasRoles([ADMIN, SUPERADMIN]),
  updatePocket: hasRoles([ADMIN, SUPERADMIN]),
  deletePocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  pocketPermissionsQuery,
  pocketPermissionsMutations,
};
