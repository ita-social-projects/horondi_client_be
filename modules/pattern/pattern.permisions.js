const { allow } = require('graphql-shield');
const { isAuthorizedAdmin } = require('../../utils/rules');

const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};
const patternPermissionsMutations = {
  addPattern: isAuthorizedAdmin,
  updatePattern: isAuthorizedAdmin,
  deletePattern: isAuthorizedAdmin,
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
