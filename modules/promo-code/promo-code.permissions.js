const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const promoCodeQuery = {
  getAllPromoCodes: hasRoles([ADMIN, SUPERADMIN]),
  getPromoCodeByCode: allow,
};

const promoCodeMutation = {
  addPromoCode: hasRoles([ADMIN, SUPERADMIN]),
  deletePromoCode: hasRoles([ADMIN, SUPERADMIN]),
  updatePromoCode: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { promoCodeMutation, promoCodeQuery };
