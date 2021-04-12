const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BOTTOM },
} = require('../../../consts/input-fields');
const {
  constructorBottomValidator,
} = require('../../../validators/constructor-items.validator');

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom: inputDataValidation(
    CONSTRUCTOR_BOTTOM,
    constructorBottomValidator
  ),
  updateConstructorBottom: inputDataValidation(
    CONSTRUCTOR_BOTTOM,
    constructorBottomValidator
  ),
  deleteConstructorBottom: inputDataValidation(
    CONSTRUCTOR_BOTTOM,
    constructorBottomValidator
  ),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
