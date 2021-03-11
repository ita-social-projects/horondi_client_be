const { allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;
const {
  addConstructorBottomValidator,
  updateConstructorBottomValidator,
} = require('../../../validators/constructor-basic.validator');
const {
  INPUT_FIELDS: { CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const { inputDataValidation } = require('../../../utils/rules');

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom:
    (inputDataValidation(CONSTRUCTOR_ELEMENT, addConstructorBottomValidator),
    hasRoles([ADMIN, SUPERADMIN])),
  updateConstructorBottom:
    (inputDataValidation(CONSTRUCTOR_ELEMENT, updateConstructorBottomValidator),
    hasRoles([ADMIN, SUPERADMIN])),
  deleteConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
