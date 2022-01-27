const { allow, and } = require('graphql-shield');

const {
  promoCodeInputValidator,
} = require('../../validators/promocode-validator');
const { hasRoles, inputDataValidation } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  PROMOCODE_FIELDS: { PROMOCODE },
} = require('../../consts/promocode-fields');

const promoCodeQuery = {
  getPromoCodeById: allow,
  getAllPromoCodes: hasRoles([ADMIN, SUPERADMIN]),
  getPromoCodeByCode: allow,
};

const promoCodeMutation = {
  addPromoCode: and(
    hasRoles([ADMIN, SUPERADMIN]),
    inputDataValidation(PROMOCODE, promoCodeInputValidator)
  ),
  updatePromoCode: and(
    hasRoles([ADMIN, SUPERADMIN]),
    inputDataValidation(PROMOCODE, promoCodeInputValidator)
  ),
  deletePromoCode: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { promoCodeMutation, promoCodeQuery };
