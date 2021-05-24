const { allow, and } = require('graphql-shield');

const Model = require('./model.model');
const { hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { MODEL },
} = require('../../consts/input-fields');
const { inputDataValidation, checkIfItemExists } = require('../../utils/rules');
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
    inputDataValidation(MODEL, modelValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(MODEL, Model)
  ),
  updateModel: and(
    inputDataValidation(MODEL, modelValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteModel: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { modelPermissionsQuery, modelPermissionsMutations };
