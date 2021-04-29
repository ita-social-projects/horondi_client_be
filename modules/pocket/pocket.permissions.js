const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { POCKET },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputPocketValidator,
} = require('../../validators/constructor-items-inputs.validator');

const pocketPermissionsQuery = {
  getAllPockets: allow,
  getPocketById: allow,
  getPocketsByModel: allow,
};

const pocketPermissionsMutations = {
  addPocket: and(
    inputDataValidation(POCKET, inputPocketValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updatePocket: and(
    inputDataValidation(POCKET, inputPocketValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deletePocket: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  pocketPermissionsQuery,
  pocketPermissionsMutations,
};
