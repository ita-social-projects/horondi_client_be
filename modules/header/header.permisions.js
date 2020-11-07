const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const headerPermissionsQuery = {
  getAllHeaders: allow,
  getHeaderById: allow,
};
const headerPermissionsMutations = {
  addHeader: hasRoles([ADMIN, SUPERADMIN]),
  updateHeader: hasRoles([ADMIN, SUPERADMIN]),
  deleteHeader: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { headerPermissionsMutations, headerPermissionsQuery };
