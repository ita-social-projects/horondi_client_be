const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_FRONT_POCKET },
} = require('../../../consts/input-fields');
const {
  constructorFrontPocketValidator,
} = require('../../../validators/constructor-items.validator');

const constructorFrontPocketPermissionsQuery = {
  getAllConstructorFrontPocket: allow,
  getConstructorFrontPocketById: allow,
};

const constructorFrontPocketPermissionsMutations = {
  addConstructorFrontPocket: inputDataValidation(
    CONSTRUCTOR_FRONT_POCKET,
    constructorFrontPocketValidator
  ),
  updateConstructorFrontPocket: inputDataValidation(
    CONSTRUCTOR_FRONT_POCKET,
    constructorFrontPocketValidator
  ),
  deleteConstructorFrontPocket: inputDataValidation(
    CONSTRUCTOR_FRONT_POCKET,
    constructorFrontPocketValidator
  ),
};

module.exports = {
  constructorFrontPocketPermissionsQuery,
  constructorFrontPocketPermissionsMutations,
};
