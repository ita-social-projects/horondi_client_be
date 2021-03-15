const { allow } = require('graphql-shield');

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
  addCategory: hasRoles([ADMIN, SUPERADMIN]),
  updateCategory: hasRoles([ADMIN, SUPERADMIN]),
  deleteCategory: hasRoles([ADMIN, SUPERADMIN]),
};

const categoryValidationMutations = {
  addCategory: inputDataValidation(CATEGORY, categoryValidator),
  updateCategory: inputDataValidation(CATEGORY, categoryValidator),
};

module.exports = {
  categoryPermissionsQuery,
  categoryPermissionsMutations,
  categoryValidationMutations,
};
