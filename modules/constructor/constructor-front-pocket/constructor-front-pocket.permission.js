const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_FRONT_POCKET },
} = require('../../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../../consts');
const {
  constructorFrontPocketValidator,
} = require('../../../validators/constructor-items.validator');

const constructorFrontPocketPermissionsQuery = {
  getAllConstructorFrontPocket: allow,
  getConstructorFrontPocketById: allow,
};

const constructorFrontPocketPermissionsMutations = {
  addConstructorFrontPocket: and(
    inputDataValidation(
      CONSTRUCTOR_FRONT_POCKET,
      constructorFrontPocketValidator
    ),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorFrontPocket: and(
    inputDataValidation(
      CONSTRUCTOR_FRONT_POCKET,
      constructorFrontPocketValidator
    ),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorFrontPocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  constructorFrontPocketPermissionsQuery,
  constructorFrontPocketPermissionsMutations,
};
