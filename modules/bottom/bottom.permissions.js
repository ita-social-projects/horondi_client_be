const { allow, and } = require('graphql-shield');

const BottomModel = require('./bottom.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { BOTTOM },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputBottomValidator,
} = require('../../validators/constructor-items-inputs.validator');

const bottomPermissionsQuery = {
  getAllBottoms: allow,
  getBottomById: allow,
};

const bottomPermissionsMutations = {
  addBottom: and(
    inputDataValidation(BOTTOM, inputBottomValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(BOTTOM, BottomModel)
  ),
  updateBottom: and(
    inputDataValidation(BOTTOM, inputBottomValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  bottomPermissionsQuery,
  bottomPermissionsMutations,
};
