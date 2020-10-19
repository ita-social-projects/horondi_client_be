const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN } = roles;
const headerPermissionsQuery = {
  getAllHeaders: allow,
  getHeaderById: allow,
};
const headerPermissionsMutations = {
  addHeader: hasRoles([ADMIN]),
  updateHeader: hasRoles([ADMIN]),
  deleteHeader: hasRoles([ADMIN]),
};

module.exports = { headerPermissionsMutations, headerPermissionsQuery };
