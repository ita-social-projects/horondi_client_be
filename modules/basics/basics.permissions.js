const { allow, and } = require('graphql-shield');

const BasicsModel = require('./basics.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { BASIC },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputBasicsValidator,
} = require('../../validators/constructor-items-inputs.validator');

const basicsPermissionsQuery = {
  getAllBasics: allow,
  getBasicById: allow,
};

const basicsPermissionsMutations = {
  addBasic: and(
    inputDataValidation(BASIC, inputBasicsValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(BASIC, BasicsModel),
  ),
  updateBasic: and(
    inputDataValidation(BASIC, inputBasicsValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  deleteBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  basicsPermissionsQuery,
  basicsPermissionsMutations,
};
