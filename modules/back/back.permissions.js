const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { BACK },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputOptionValidator,
} = require('../../validators/constructor-items-inputs.validator');

const backPermissionsQuery = {
  getAllBacks: allow,
  getBackById: allow,
  getBacksByModel: allow,
};

const backPermissionsMutations = {
  addBack: and(
    inputDataValidation(BACK, inputOptionValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateBack: and(
    inputDataValidation(BACK, inputOptionValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteBack: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  backPermissionsQuery,
  backPermissionsMutations,
};
