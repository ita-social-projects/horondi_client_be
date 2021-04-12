const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { STRAP },
} = require('../../consts/input-fields');
const {
  strapValidator,
} = require('../../validators/constructor-items.validator');

const strapPermissionsQuery = {
  getAllStraps: allow,
  getStrapById: allow,
  getStrapsByModel: allow,
};

const strapPermissionsMutations = {
  addStrap: inputDataValidation(STRAP, strapValidator),
  updateStrap: inputDataValidation(STRAP, strapValidator),
  deleteStrap: inputDataValidation(STRAP, strapValidator),
};

module.exports = {
  strapPermissionsQuery,
  strapPermissionsMutations,
};
