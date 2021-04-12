const { and } = require('graphql-shield');

const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { LIMIT, SKIP, RESTRICTION },
} = require('../../consts/input-fields');
const {
  restrictionValidator,
} = require('../../validators/constructor-items.validator');
const { getAllOrdersValidator } = require('../../validators/order.validator');

const restrictionPermissionsMutations = {
  addRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
  updateRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
  deleteRestriction: inputDataValidation(RESTRICTION, restrictionValidator),
};

const restrictionPermissionsQuery = {
  getAllRestrictions: and(
    inputDataValidation(LIMIT, getAllOrdersValidator.limitValidator),
    inputDataValidation(SKIP, getAllOrdersValidator.skipValidator)
  ),
};

module.exports = {
  restrictionPermissionsQuery,
  restrictionPermissionsMutations,
};
