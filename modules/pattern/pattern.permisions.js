const { allow, and } = require('graphql-shield');

const PatternModel = require('./pattern.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { PATTERN },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputPatternValidator,
} = require('../../validators/constructor-items-inputs.validator');

const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};

const patternPermissionsMutations = {
  addPattern: and(
    inputDataValidation(PATTERN, inputPatternValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(PATTERN, PatternModel),
  ),
  updatePattern: and(
    inputDataValidation(PATTERN, inputPatternValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  deletePattern: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
