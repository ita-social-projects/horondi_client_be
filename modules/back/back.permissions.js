const { allow, and } = require('graphql-shield');

const BackModel = require('./back.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { BACK },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputBackValidator,
} = require('../../validators/constructor-items-inputs.validator');

const backPermissionsQuery = {
  getAllBacks: allow,
  getBackById: allow,
  getBacksByModel: allow,
};

const backPermissionsMutations = {
  addBack: and(
    inputDataValidation(BACK, inputBackValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(BACK, BackModel),
  ),
  updateBack: and(
    inputDataValidation(BACK, inputBackValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  deleteBack: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  backPermissionsQuery,
  backPermissionsMutations,
};
