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

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_ELEMENT, constructorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
