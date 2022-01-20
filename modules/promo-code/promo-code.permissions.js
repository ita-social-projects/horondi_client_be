const { allow } = require('graphql-shield');

const promoCodeMutation = {
  addPromoCode: allow,
  deletePromoCode: allow,
  updatePromoCode: allow,
};

module.exports = { promoCodeMutation };
