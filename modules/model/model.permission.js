const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;
const { checkImageType, checkImageSize } = require('../../utils/rules');

const modelPermissionsQuery = {
  getAllCategories: allow,
  getModelsByCategory: allow,
  getModelsForConstructor: allow,
};

const modelPermissionsMutations = {
  addModel: and(hasRoles([ADMIN, SUPERADMIN]), checkImageType, checkImageSize),
  updateModel: and(
    hasRoles([ADMIN, SUPERADMIN]),
    checkImageType,
    checkImageSize
  ),
  deleteModel: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { modelPermissionsQuery, modelPermissionsMutations };
