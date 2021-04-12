const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;

const modelPermissionsQuery = {
  getAllCategories: allow,
  getModelsByCategory: allow,
  getModelsForConstructor: allow,
};

const modelPermissionsMutations = {
  addModel: hasRoles([ADMIN, SUPERADMIN]),
  updateModel: hasRoles([ADMIN, SUPERADMIN]),
  deleteModel: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { modelPermissionsQuery, modelPermissionsMutations };
