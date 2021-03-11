const { allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;
const {
  addConstructorBasicValidator,
  updateConstructorBasicValidator,
} = require('../../../validators/constructor-basic.validator');
const {
  INPUT_FIELDS: { CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const { inputDataValidation } = require('../../../utils/rules');

const constructorBasicPermissionsQuery = {
  getAllConstructorBasics: allow,
  getConstructorBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addConstructorBasic:
    (inputDataValidation(CONSTRUCTOR_ELEMENT, addConstructorBasicValidator),
    hasRoles([ADMIN, SUPERADMIN])),
  updateConstructorBasic:
    (inputDataValidation(CONSTRUCTOR_ELEMENT, updateConstructorBasicValidator),
    hasRoles([ADMIN, SUPERADMIN])),
  deleteConstructorBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
};
