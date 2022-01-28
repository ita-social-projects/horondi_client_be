const promoCodeService = require('./promo-code.service');

const promoCodeQuery = {
  getAllPromoCodes: async (_, args) => promoCodeService.getAllPromoCodes(args),

  getPromoCodeById: async (_, { id }) => promoCodeService.getPromoCodeById(id),

  getPromoCodeByCode: async (_, { code }) =>
    promoCodeService.getPromoCodeByCode(code),
};

const promoCodeMutation = {
  addPromoCode: async (_, { promoCode }) =>
    promoCodeService.addPromoCode(promoCode),

  deletePromoCode: async (_, { id }) => promoCodeService.deletePromoCode(id),

  updatePromoCode: async (_, { id, promoCode }) =>
    promoCodeService.updatePromoCode(id, promoCode),
};

module.exports = { promoCodeQuery, promoCodeMutation };
