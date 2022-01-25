const _ = require('lodash');
const RuleError = require('../../errors/rule.error');
const PromoCode = require('./promo-code.model');
const {
  STATUS_CODES: { NOT_FOUND, FORBIDDEN },
} = require('../../consts/status-codes');
const {
  PROMOCODE_NOT_FOUND,
  PROMOCODE_HAS_NOT_CHANGED,
} = require('../../error-messages/promocode-messages');

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

  async updatePromoCode(id, promoCodeData) {
    const promoCode = await PromoCode.findById(id)
      .lean()
      .exec();

    if (!promoCode) {
      throw new RuleError(PROMOCODE_NOT_FOUND, NOT_FOUND);
    }

    if (_.isMatch(promoCodeData, promoCode)) {
      throw new RuleError(PROMOCODE_HAS_NOT_CHANGED, FORBIDDEN);
    }

    return PromoCode.findByIdAndUpdate(id, promoCodeData, {
      new: true,
    }).exec();
  }
}

module.exports = new PromoCodeService();
