const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { RESTRICTION },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  restrictionValidator,
} = require('../../validators/constructor-items-inputs.validator');

const restrictionPermissionsMutations = {
  addRestriction: and(
    inputDataValidation(RESTRICTION, restrictionValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateRestriction: and(
    inputDataValidation(RESTRICTION, restrictionValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteRestriction: hasRoles([ADMIN, SUPERADMIN]),
};

const restrictionPermissionsQuery = {
  getAllRestrictions: allow,
};

module.exports = {
  restrictionPermissionsQuery,
  restrictionPermissionsMutations,
};
