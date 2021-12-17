const { allow, and } = require('graphql-shield');

const ConstructorBottomModel = require('./constructor-bottom.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../../utils/rules');
const {
  INPUT_FIELDS: { CONSTRUCTOR_BOTTOM, CONSTRUCTOR_ELEMENT },
} = require('../../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../../consts');
const {
  inputConstructorElementValidator,
} = require('../../../validators/constructor-items-inputs.validator');

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_BOTTOM, inputConstructorElementValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(CONSTRUCTOR_ELEMENT, ConstructorBottomModel),
  ),
  updateConstructorBottom: and(
    inputDataValidation(CONSTRUCTOR_BOTTOM, inputConstructorElementValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  deleteConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
