const { ApolloError } = require('apollo-server');
const Currency = require('./currency.model');
const {
  CURRENCY_ALREADY_EXIST,
} = require('../../error-messages/currency.messages');
const checkCurrencyExist = require('../../utils/checkCurrencyExist');

class CurrencyService {
  async getAllCurrencies() {
    return await Currency.find();
  }

  async getCurrencyById(id) {
    return await Currency.findById(id);
  }

  async updateCurrency(id, currency) {
    return await Currency.findByIdAndUpdate(id, currency, { new: true });
  }

  async addCurrency(data) {
    if (await checkCurrencyExist(data)) {
      return new ApolloError(CURRENCY_ALREADY_EXIST, 400);
    }
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    return await Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrencyService();
