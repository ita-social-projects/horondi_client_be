const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;
const { sizeInputValidator } = require('../../validators/size.validator');
const { inputDataValidation } = require('../../utils/rules');

const {
  INPUT_FIELDS: { SIZE },
} = require('../../consts/input-fields');

const sizePermissionsQuery = {
  getAllSizes: allow,
  getSizeById: allow,
};

const sizePermissionsMutations = {
  addSize: and(
    inputDataValidation(SIZE, sizeInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteSize: hasRoles([ADMIN, SUPERADMIN]),
  updateSize: and(
    inputDataValidation(SIZE, sizeInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = {
  sizePermissionsMutations,
  sizePermissionsQuery,
};
