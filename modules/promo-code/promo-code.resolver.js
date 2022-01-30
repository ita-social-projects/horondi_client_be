const { ApolloError } = require('apollo-server');
const promoCodeService = require('./promo-code.service');

const promoCodeQuery = {
  getAllPromoCodes: () => promoCodeService.getAllPromoCodes(),

  getPromoCodeById: async ({ id }) => promoCodeService.getPromoCodeById(id),

  getPromoCodeByCode: async (_, { code }) => {
    try {
      return await promoCodeService.getPromoCodeByCode(code);
    } catch (e) {
      return new ApolloError(e.message, e.statusCode);
    }
  },
};

const promoCodeMutation = {
  addPromoCode: async (_, { promoCode }) =>
    promoCodeService.addPromoCode(promoCode),

  deletePromoCode: async (_, args) => promoCodeService.deletePromoCode(args.id),

  updatePromoCode: async (_, args) =>
    promoCodeService.updatePromoCode(args.id, args.promoCode),
};

module.exports = { promoCodeQuery, promoCodeMutation };
