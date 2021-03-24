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

const constructorFrontPocketPermissionsQuery = {
  getAllConstructorFrontPocket: allow,
  getConstructorFrontPocketById: allow,
};

const constructorFrontPocketPermissionsMutations = {
  addConstructorFrontPocket: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorFrontPocket: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorFrontPocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorFrontPocketPermissionsQuery,
  constructorFrontPocketPermissionsMutations,
};
