const RuleError = require('../../errors/rule.error');
const PromoCode = require('./promo-code.model');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  PROMOCODE_NOT_FOUND,
} = require('../../error-messages/promocode-messages');

class PromoCodeService {
  async getAllPromoCodes({ skip, limit }) {
    const items = await PromoCode.find().skip(skip).limit(limit).exec();

    const count = items.length;

    return {
      items,
      count,
    };
  }

  async getPromoCodeById(id) {
    const promoCode = await PromoCode.findById(id).exec();

    if (!promoCode) {
      throw new RuleError(PROMOCODE_NOT_FOUND, NOT_FOUND);
    }

    return promoCode;
  }

  async getPromoCodeByCode(code) {
    const currentDate = new Date();
    const promoCode = await PromoCode.findOne({
      code,
      dateFrom: { $lte: currentDate },
      dateTo: { $gt: currentDate },
    }).exec();

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

  async updatePromoCode(id, promoCodeData) {
    await this.getPromoCodeById(id);

    return PromoCode.findByIdAndUpdate(id, promoCodeData, {
      new: true,
    }).exec();
  }
}

module.exports = new PromoCodeService();
