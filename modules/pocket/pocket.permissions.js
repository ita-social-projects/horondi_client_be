const { allow, and } = require('graphql-shield');
const { inputDataValidation, hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const {
  INPUT_FIELDS: { POCKET },
} = require('../../consts/input-fields');
const {
  pocketValidator,
  nestedSideValidator,
} = require('../../validators/constructor-items.validator');

const { ADMIN, SUPERADMIN } = roles;

const pocketPermissionsQuery = {
  getAllPockets: allow,
  getPocketById: allow,
  getPocketsByModel: allow,
};

const pocketPermissionsMutations = {
  addPocket: and(
    inputDataValidation(POCKET, pocketValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updatePocket: hasRoles([ADMIN, SUPERADMIN]),
  deletePocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  pocketPermissionsQuery,
  pocketPermissionsMutations,
};
