const RuleError = require('../../errors/rule.error');
const PromoCode = require('./promo-code.model');

const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  PROMOCODE_NOT_FOUND,
} = require('../../error-messages/promocode.messages');

class PromoCodeService {
  async getAllPromoCodes() {
    const items = await PromoCode.find().exec();
    return {
      items,
    };
  }

  async getPromoCodeById(id) {
    const promoCode = await PromoCode.findById(id).exec();
    if (promoCode) {
      return promoCode;
    }
  }

  async getPromoCodeByCode(code) {
    const promoCode = await PromoCode.findOne({ code }).exec();

    if (!promoCode) {
      throw new RuleError(PROMOCODE_NOT_FOUND, NOT_FOUND);
    }

    return promoCode;
  }

  async addPromoCode(promoCode) {
    return new PromoCode(promoCode).save();
  }

  async deletePromoCode(id) {
    const promoCode = await PromoCode.findByIdAndDelete(id).exec();

    if (promoCode) {
      return promoCode;
    }
  }
}

module.exports = new PromoCodeService();
