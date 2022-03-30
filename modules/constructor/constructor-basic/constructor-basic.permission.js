const { allow, and } = require('graphql-shield');

const ConstructorBasicModel = require('./constructor-basic.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BASIC, CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../../consts');
const {
  inputConstructorElementValidator,
} = require('../../../validators/constructor-items-inputs.validator');

const constructorBasicPermissionsQuery = {
  getAllConstructorBasics: allow,
  getConstructorBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_BASIC, inputConstructorElementValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(CONSTRUCTOR_ELEMENT, ConstructorBasicModel)
  ),
  updateConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_BASIC, inputConstructorElementValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
};
