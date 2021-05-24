const { allow, and } = require('graphql-shield');

const ClosureModel = require('./closures.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { CLOSURE },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputOptionValidator,
} = require('../../validators/constructor-items-inputs.validator');

const closurePermissionsQuery = {
  getAllClosure: allow,
  getClosureById: allow,
};

const closurePermissionsMutations = {
  addClosure: and(
    inputDataValidation(CLOSURE, inputOptionValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(CLOSURE, ClosureModel)
  ),
  updateClosure: and(
    inputDataValidation(CLOSURE, inputOptionValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteClosure: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { closurePermissionsQuery, closurePermissionsMutations };
