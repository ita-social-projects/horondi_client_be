const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN } = roles;
const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};
const patternPermissionsMutations = {
  addPattern: hasRoles([ADMIN]),
  updatePattern: hasRoles([ADMIN]),
  deletePattern: hasRoles([ADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
