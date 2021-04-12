const { allow } = require('graphql-shield');

const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { RESTRICTION },
} = require('../../consts/input-fields');
const {
  restrictionValidator,
} = require('../../validators/constructor-items.validator');

const restrictionPermissionsMutations = {
  addRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
  updateRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
  deleteRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
};

const restrictionPermissionsQuery = {
  getAllRestrictions: allow,
};

module.exports = {
  restrictionPermissionsQuery,
  restrictionPermissionsMutations,
};
