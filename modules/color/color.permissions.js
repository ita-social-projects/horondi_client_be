const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;
const { colorValidator } = require('../../validators/business-text.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  DB_COLLECTIONS_NAMES: { COLOR },
} = require('../../consts/db-collections-names');

const colorPermissionsQuery = {
  getAllColors: allow,
  getColorById: allow,
};
const colorPermissionsMutations = {
  addColor: and(
    inputDataValidation(COLOR, colorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteColor: and(
    inputDataValidation(COLOR, colorValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = {
  colorPermissionsQuery,
  colorPermissionsMutations,
};
