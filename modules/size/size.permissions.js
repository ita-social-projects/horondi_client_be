const { allow, and } = require('graphql-shield');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { SIZE },
} = require('../../consts/input-fields');
const {
  sizeValidator,
} = require('../../validators/constructor-items.validator');

const sizePermissionsQuery = {
  getAllSizes: allow,
  getSizeById: allow,
};

const sizePermissionsMutations = {
  addSize: inputDataValidation(SIZE, sizeValidator),
  deleteSize: inputDataValidation(SIZE, sizeValidator),
  updateSize: inputDataValidation(SIZE, sizeValidator),
};

module.exports = {
  sizePermissionsMutations,
  sizePermissionsQuery,
};
