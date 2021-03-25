const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;

const backPermissionsQuery = {
  getAllBacks: allow,
  getBackById: allow,
  getBacksByModel: allow,
};

const backPermissionsMutations = {
  addBack: hasRoles([ADMIN, SUPERADMIN]),
  updateBack: hasRoles([ADMIN, SUPERADMIN]),
  deleteBack: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  backPermissionsQuery,
  backPermissionsMutations,
};
