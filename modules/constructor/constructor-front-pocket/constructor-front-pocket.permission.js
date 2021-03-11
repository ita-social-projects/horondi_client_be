const { allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;
const {
  addConstructorFrontPocketValidator,
  updateConstructorFrontPocketValidator,
} = require('../../../validators/constructor-basic.validator');
const {
  INPUT_FIELDS: { CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const { inputDataValidation } = require('../../../utils/rules');

const constructorFrontPocketPermissionsQuery = {
  getAllConstructorFrontPocket: allow,
  getConstructorFrontPocketById: allow,
};

const constructorFrontPocketPermissionsMutations = {
  addConstructorFrontPocket:
    (inputDataValidation(
      CONSTRUCTOR_ELEMENT,
      addConstructorFrontPocketValidator
    ),
    hasRoles([ADMIN, SUPERADMIN])),
  updateConstructorFrontPocket:
    (inputDataValidation(
      CONSTRUCTOR_ELEMENT,
      updateConstructorFrontPocketValidator
    ),
    hasRoles([ADMIN, SUPERADMIN])),
  deleteConstructorFrontPocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorFrontPocketPermissionsQuery,
  constructorFrontPocketPermissionsMutations,
};
