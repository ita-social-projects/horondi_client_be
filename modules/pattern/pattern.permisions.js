const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { PATTERN },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  patternValidator,
} = require('../../validators/constructor-items.validator');

const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};

const patternPermissionsMutations = {
  addPattern: hasRoles([ADMIN, SUPERADMIN]),
  updatePattern: and(
    inputDataValidation(PATTERN, patternValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deletePattern: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
