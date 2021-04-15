const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BASIC },
} = require('../../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../../consts');
const {
  constructorBasicValidator,
} = require('../../../validators/constructor-items.validator');

const constructorBasicPermissionsQuery = {
  getAllConstructorBasics: allow,
  getConstructorBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_BASIC, constructorBasicValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorBasic: and(
    inputDataValidation(CONSTRUCTOR_BASIC, constructorBasicValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
};
