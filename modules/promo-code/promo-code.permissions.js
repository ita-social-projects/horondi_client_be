const { allow } = require('graphql-shield');

const promoCodeQuery = {
  getAllPromoCodes: allow,
  getPromoCodeByCode: allow,
};

const promoCodeMutation = {
  addPromoCode: allow,
  deletePromoCode: allow,
  updatePromoCode: allow,
};

module.exports = { promoCodeMutation, promoCodeQuery };
