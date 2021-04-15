const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { STRAP },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  strapValidator,
} = require('../../validators/constructor-items.validator');

const strapPermissionsQuery = {
  getAllStraps: allow,
  getStrapById: allow,
  getStrapsByModel: allow,
};

const strapPermissionsMutations = {
  addStrap: and(
    inputDataValidation(STRAP, strapValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateStrap: and(
    inputDataValidation(STRAP, strapValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteStrap: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  strapPermissionsQuery,
  strapPermissionsMutations,
};
