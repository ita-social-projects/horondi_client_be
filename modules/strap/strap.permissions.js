const { allow, and } = require('graphql-shield');

const StrapModel = require('./strap.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { STRAP },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputStrapValidator,
} = require('../../validators/constructor-items-inputs.validator');

const strapPermissionsQuery = {
  getAllStraps: allow,
  getStrapById: allow,
  getStrapsByModel: allow,
};

const strapPermissionsMutations = {
  addStrap: and(
    inputDataValidation(STRAP, inputStrapValidator),
    checkIfItemExists(STRAP, StrapModel)
  ),
  updateStrap: and(inputDataValidation(STRAP, inputStrapValidator)),
};

module.exports = {
  strapPermissionsQuery,
  strapPermissionsMutations,
};
