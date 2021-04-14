const { allow, and } = require('graphql-shield');
const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { SIZE },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  sizeValidator,
} = require('../../validators/constructor-items.validator');

const sizePermissionsQuery = {
  getAllSizes: allow,
  getSizeById: allow,
};

const sizePermissionsMutations = {
  addSize: and(
    inputDataValidation(SIZE, sizeValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteSize: and(
    inputDataValidation(SIZE, sizeValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateSize: and(
    inputDataValidation(SIZE, sizeValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = {
  sizePermissionsMutations,
  sizePermissionsQuery,
};
