const { and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');
const {
  currencyInputValidator,
} = require('../../validators/currency.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { CURRENCY },
} = require('../../consts/input-fields');

const currencyMutation = {
  addCurrency: and(
    inputDataValidation(CURRENCY, currencyInputValidator),
    hasRoles([SUPERADMIN, ADMIN])
  ),
  deleteCurrency: hasRoles([SUPERADMIN, ADMIN]),
  updateCurrency: and(
    inputDataValidation(CURRENCY, currencyInputValidator),
    hasRoles([SUPERADMIN, ADMIN])
  ),
};

module.exports = { currencyMutation };
