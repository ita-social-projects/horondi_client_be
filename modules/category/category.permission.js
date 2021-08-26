const { allow, and } = require('graphql-shield');

const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const { categoryValidator } = require('../../validators/category.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { CATEGORY },
} = require('../../consts/input-fields');

const categoryPermissionsQuery = {
  getAllCategories: allow,
  getCategoryById: allow,
};

const categoryPermissionsMutations = {
  addCategory: and(
    inputDataValidation(CATEGORY, categoryValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateCategory: and(
    inputDataValidation(CATEGORY, categoryValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteCategory: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  categoryPermissionsQuery,
  categoryPermissionsMutations,
};
