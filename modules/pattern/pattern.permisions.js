const { allow } = require('graphql-shield');

const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { PATTERN },
} = require('../../consts/input-fields');
const {
  patternValidator,
} = require('../../validators/constructor-items.validator');

const patternPermissionsQuery = {
  getAllPatterns: allow,
  getPatternById: allow,
};

const patternPermissionsMutations = {
  addPattern: inputDataValidation(PATTERN, patternValidator),
  updatePattern: inputDataValidation(PATTERN, patternValidator),
  deletePattern: inputDataValidation(PATTERN, patternValidator),
};

module.exports = { patternPermissionsMutations, patternPermissionsQuery };
