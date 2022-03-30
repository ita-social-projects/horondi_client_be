const { ApolloError } = require('apollo-server');
const promoCodeService = require('./promo-code.service');

const promoCodeQuery = {
  getAllPromoCodes: async (_, args) => promoCodeService.getAllPromoCodes(args),

  getPromoCodeById: async (_, { id }) => promoCodeService.getPromoCodeById(id),

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

  deletePromoCode: async (_, { id }) => promoCodeService.deletePromoCode(id),

  updatePromoCode: async (_, { id, promoCode }) =>
    promoCodeService.updatePromoCode(id, promoCode),
};

module.exports = { promoCodeQuery, promoCodeMutation };
