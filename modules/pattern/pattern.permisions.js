const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};
const patternPermissionsMutations = {
  addPattern: hasRoles([ADMIN, SUPERADMIN]),
  updatePattern: hasRoles([ADMIN, SUPERADMIN]),
  deletePattern: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
