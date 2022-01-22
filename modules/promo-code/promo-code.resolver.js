const PromoCodeService = require('./promo-code.service');

const promoCodeQuery = {
  getAllPromoCodes: () => PromoCodeService.getAllPromoCodes(),

  getPromoCodeById: async ({ id }) => PromoCodeService.getPromoCodeById(id),

  getPromoCodeByCode: async (_, { code }) =>
    PromoCodeService.getPromoCodeByCode(code),
};

const promoCodeMutation = {
  addPromoCode: async (_, { promoCode }) =>
    PromoCodeService.addPromoCode(promoCode),

  deletePromoCode: async (_, args) => PromoCodeService.deletePromoCode(args.id),

  updatePromoCode: async (_, args) =>
    PromoCodeService.updatePromoCode(args.id, args.promoCode),
};

module.exports = { promoCodeQuery, promoCodeMutation };
