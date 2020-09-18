const { allow, or } = require('graphql-shield');
const { isAuthorized, hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN } = roles;
const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};
const patternPermissionsMutations = {
  addPattern: or(isAuthorized, hasRoles([ADMIN])),
  updatePattern: or(isAuthorized, hasRoles([ADMIN])),
  deletePattern: or(isAuthorized, hasRoles([ADMIN])),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
