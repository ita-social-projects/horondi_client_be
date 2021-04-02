const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { checkImageType, checkImageSize } = require('../../utils/rules');

const { ADMIN, SUPERADMIN } = roles;
const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};
const patternPermissionsMutations = {
  addPattern: and(
    hasRoles([ADMIN, SUPERADMIN]),
    checkImageType,
    checkImageSize
  ),
  updatePattern: and(
    hasRoles([ADMIN, SUPERADMIN]),
    checkImageType,
    checkImageSize
  ),
  deletePattern: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
