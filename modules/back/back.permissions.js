const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { BACK },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  backValidator,
} = require('../../validators/constructor-items.validator');

const backPermissionsQuery = {
  getAllBacks: allow,
  getBackById: allow,
  getBacksByModel: allow,
};

const backPermissionsMutations = {
  addBack: and(
    inputDataValidation(BACK, backValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateBack: and(
    inputDataValidation(BACK, backValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteBack: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  backPermissionsQuery,
  backPermissionsMutations,
};
