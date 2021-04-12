const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BASIC },
} = require('../../../consts/input-fields');
const {
  constructorBasicValidator,
} = require('../../../validators/constructor-items.validator');

const constructorBasicPermissionsQuery = {
  getAllConstructorBasics: allow,
  getConstructorBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addConstructorBasic: inputDataValidation(
    CONSTRUCTOR_BASIC,
    constructorBasicValidator
  ),
  updateConstructorBasic: inputDataValidation(
    CONSTRUCTOR_BASIC,
    constructorBasicValidator
  ),
  deleteConstructorBasic: inputDataValidation(
    CONSTRUCTOR_BASIC,
    constructorBasicValidator
  ),
};

module.exports = {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
};
