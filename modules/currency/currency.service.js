const Currency = require('./currency.model');
const {
  CURRENCY_ALREADY_EXIST,
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

class CurrencyService {
  async getAllCurrencies() {
    return await Currency.find();
  }

  async getCurrencyById(id) {
    return await Currency.findById(id);
  }

  async updateCurrency(id, currency) {
    if (await this.checkNewsExist(currency)) {
      throw new Error(CURRENCY_ALREADY_EXIST);
    }
    return await Currency.findByIdAndUpdate(id, currency, { new: true });
  }

  async addCurrency(data) {
    if (await this.checkCurrencyExist(data)) {
      throw new Error(CURRENCY_ALREADY_EXIST);
    }
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    return await Currency.findByIdAndDelete(id);
  }

  async checkCurrencyExist(data) {
    const currency = await Currency.countDocuments({
      convertOptions: {
        $elemMatch: {
          $or: [
            { name: data.convertOptions[0].name },
            { name: data.convertOptions[1].name },
          ],
        },
      },
    });
    return currency > 0;
  }
}
module.exports = new CurrencyService();
