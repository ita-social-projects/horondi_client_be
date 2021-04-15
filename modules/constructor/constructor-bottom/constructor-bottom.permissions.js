const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BOTTOM },
} = require('../../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../../consts');
const {
  constructorBottomValidator,
} = require('../../../validators/constructor-items.validator');

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_BOTTOM, constructorBottomValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_BOTTOM, constructorBottomValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
