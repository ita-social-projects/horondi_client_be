const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { PATTERN },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  crudPatternValidator,
} = require('../../validators/constructor-items-inputs.validator');

const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};

const patternPermissionsMutations = {
  addPattern: and(
    inputDataValidation(PATTERN, crudPatternValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updatePattern: and(
    inputDataValidation(PATTERN, crudPatternValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deletePattern: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
