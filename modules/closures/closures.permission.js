const { allow } = require('graphql-shield');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { CLOSURE },
} = require('../../consts/input-fields');
const {
  closureValidator,
} = require('../../validators/constructor-items.validator');

const closurePermissionsQuery = {
  getAllClosure: allow,
  getClosureById: allow,
};

const closurePermissionsMutations = {
  addClosure: inputDataValidation(CLOSURE, closureValidator),
  updateClosure: inputDataValidation(CLOSURE, closureValidator),
  deleteClosure: inputDataValidation(CLOSURE, closureValidator),
};

module.exports = { closurePermissionsQuery, closurePermissionsMutations };
