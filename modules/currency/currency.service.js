const { ApolloError } = require('apollo-server');
const Currency = require('./currency.model');
const {
  CURRENCY_ALREADY_EXIST,
} = require('../../error-messages/currency.messages');

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
    const currency = await Currency.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    if (currency.length !== 0) {
      return new ApolloError(CURRENCY_ALREADY_EXIST, 400);
    }
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    return await Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrencyService();
