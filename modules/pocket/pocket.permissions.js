const { allow, and } = require('graphql-shield');
const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { POCKET },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  pocketValidator,
} = require('../../validators/constructor-items.validator');

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
  updatePocket: and(
    inputDataValidation(POCKET, pocketValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deletePocket: and(
    inputDataValidation(POCKET, pocketValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = {
  pocketPermissionsQuery,
  pocketPermissionsMutations,
};
