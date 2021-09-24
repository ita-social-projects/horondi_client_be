const { allow, and } = require('graphql-shield');

const ConstructorModel = require('./constructor.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputConstructorValidator,
} = require('../../validators/constructor-items-inputs.validator');

const constructorPermissionsQuery = {
  getAllConstructors: allow,
  getConstructorById: allow,
  getConstructorByModel: allow,
};

const constructorPermissionsMutations = {
  addConstructor: and(
    inputDataValidation(CONSTRUCTOR, inputConstructorValidator),
    checkIfItemExists(CONSTRUCTOR, ConstructorModel),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructor: and(
    inputDataValidation(CONSTRUCTOR, inputConstructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructor: and(hasRoles([ADMIN, SUPERADMIN])),
};

module.exports = {
  constructorPermissionsMutations,
  constructorPermissionsQuery,
};
