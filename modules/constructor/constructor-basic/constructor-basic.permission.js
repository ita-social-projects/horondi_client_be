const { and, allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;
const {
  constructorValidator,
} = require('../../../validators/constructor.validator');
const {
  INPUT_FIELDS: { CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const { inputDataValidation } = require('../../../utils/rules');

const constructorBasicPermissionsQuery = {
  getAllConstructorBasics: allow,
  getConstructorBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
};
