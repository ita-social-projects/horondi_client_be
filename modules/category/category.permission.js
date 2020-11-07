const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;

const categoryPermissionsQuery = {
  getAllCategories: allow,
  getCategoryById: allow,
};

const categoryPermissionsMutations = {
  addCategory: hasRoles([ADMIN, SUPERADMIN]),
  updateCategory: hasRoles([ADMIN, SUPERADMIN]),
  deleteCategory: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { categoryPermissionsQuery, categoryPermissionsMutations };
