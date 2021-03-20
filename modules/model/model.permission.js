const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { MODEL },
} = require('../../consts/input-fields');
const { inputDataValidation } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;
const { modelValidator } = require('../../validators/model.validator');

const modelPermissionsQuery = {
  getAllCategories: allow,
  getModelsByCategory: allow,
  getModelsForConstructor: allow,
};

const modelPermissionsMutations = {
  addModel: and(
    hasRoles([ADMIN, SUPERADMIN]),
    inputDataValidation(MODEL, modelValidator)
  ),
  updateModel: and(
    hasRoles([ADMIN, SUPERADMIN]),
    inputDataValidation(MODEL, modelValidator)
  ),
  deleteModel: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { modelPermissionsQuery, modelPermissionsMutations };
