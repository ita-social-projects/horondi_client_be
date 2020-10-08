const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN } = roles;

const categoryPermissionsQuery = {
  getAllCategories: allow,
  getCategoryById: allow,
};

const categoryPermissionsMutations = {
  addCategory: hasRoles([ADMIN]),
  addCategory: hasRoles([ADMIN]),
  deleteCategory: hasRoles([ADMIN]),
};

module.exports = { categoryPermissionsQuery, categoryPermissionsMutations };
