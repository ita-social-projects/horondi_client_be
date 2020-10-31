const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN } = roles;

const modelPermissionsQuery = {
  getAllCategories: allow,
  getModelsByCategory: allow,
};

const modelPermissionsMutations = {
  addModel: hasRoles([ADMIN]),
  updateModel: hasRoles([ADMIN]),
  deleteModel: hasRoles([ADMIN]),
};

module.exports = { modelPermissionsQuery, modelPermissionsMutations };
