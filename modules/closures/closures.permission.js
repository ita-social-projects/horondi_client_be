const { allow, and } = require('graphql-shield');

const { inputDataValidation, hasRoles } = require('../../utils/rules');
const {
  INPUT_FIELDS: { CLOSURE },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  crudClosureValidator,
} = require('../../validators/constructor-items-inputs.validator');

const closurePermissionsQuery = {
  getAllClosure: allow,
  getClosureById: allow,
};

const closurePermissionsMutations = {
  addClosure: and(
    inputDataValidation(CLOSURE, crudClosureValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  updateClosure: and(
    inputDataValidation(CLOSURE, crudClosureValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteClosure: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { closurePermissionsQuery, closurePermissionsMutations };
