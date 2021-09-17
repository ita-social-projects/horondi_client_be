const { allow, and } = require('graphql-shield');

const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const { headerInputValidator } = require('../../validators/header.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { HEADER },
} = require('../../consts/input-fields');

const headerPermissionsQuery = {
  getAllHeaders: allow,
  getHeaderById: allow,
};
const headerPermissionsMutations = {
  addHeader: and(
    inputDataValidation(HEADER, headerInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateHeader: and(
    inputDataValidation(HEADER, headerInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteHeader: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { headerPermissionsMutations, headerPermissionsQuery };
