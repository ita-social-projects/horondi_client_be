const { allow, and } = require('graphql-shield');

const BasicsModel = require('./basics.model');
const {
  inputDataValidation,
  hasRoles,
  checkIfItemExists,
} = require('../../utils/rules');
const {
  INPUT_FIELDS: { BASICS },
} = require('../../consts/input-fields');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  inputBasicsValidator,
} = require('../../validators/constructor-items-inputs.validator');

const basicsPermissionsQuery = {
  getAllBasics: allow,
  getBasicsById: allow,
};

const basicsPermissionsMutations = {
  addBasics: and(
    inputDataValidation(BASICS, inputBasicsValidator),
    hasRoles([ADMIN, SUPERADMIN]),
    checkIfItemExists(BASICS, BasicsModel)
  ),
  update: and(
    inputDataValidation(BASICS, inputBasicsValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  delete: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  basicsPermissionsQuery,
  basicsPermissionsMutations,
};
