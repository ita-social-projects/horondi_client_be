const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { BACK },
} = require('../../consts/input-fields');
const {
  backValidator,
} = require('../../validators/constructor-items.validator');

const backPermissionsQuery = {
  getAllBacks: allow,
  getBackById: allow,
  getBacksByModel: allow,
};

const backPermissionsMutations = {
  addBack: inputDataValidation(BACK, backValidator),
  updateBack: inputDataValidation(BACK, backValidator),
  deleteBack: inputDataValidation(BACK, backValidator),
};

module.exports = {
  backPermissionsQuery,
  backPermissionsMutations,
};
