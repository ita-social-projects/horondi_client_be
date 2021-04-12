const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { POCKET },
} = require('../../consts/input-fields');
const {
  pocketValidator,
} = require('../../validators/constructor-items.validator');

const pocketPermissionsQuery = {
  getAllPockets: allow,
  getPocketById: allow,
  getPocketsByModel: allow,
};

const pocketPermissionsMutations = {
  addPocket: inputDataValidation(POCKET, pocketValidator),
  updatePocket: inputDataValidation(POCKET, pocketValidator),
  deletePocket: inputDataValidation(POCKET, pocketValidator),
};

module.exports = {
  pocketPermissionsQuery,
  pocketPermissionsMutations,
};
