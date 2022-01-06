const PromoCode = require('./promo-code.model');

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
