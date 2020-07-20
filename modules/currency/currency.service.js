const { ApolloError } = require('apollo-server');
const Currency = require('./currency.model');

const CURRENCY_NOT_FOUND = JSON.stringify([
  {
    lang: 'uk',
    value: 'Валюту не знайдено',
  },
  {
    lang: 'eng',
    value: 'Currency not found',
  },
]);
const CURRENCY_ALREADY_EXIST = [
  { lang: 'uk', value: 'Валюта вже існує' },
  { lang: 'eng', value: 'Currency already exist' },
];
class CurrencyService {
  async getAllCurrencies() {
    return await Currency.find();
  }

  async getCurrencyById(id) {
    return (
      (await Currency.findById(id)) || new ApolloError(CURRENCY_NOT_FOUND, 404)
    );
  }

  async updateCurrency(id, currency) {
    return (
      (await Currency.findByIdAndUpdate(id, currency, { new: true }))
      || new ApolloError(CURRENCY_NOT_FOUND, 404)
    );
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
    return (
      (await Currency.findByIdAndDelete(id))
      || new ApolloError(CURRENCY_NOT_FOUND, 400)
    );
  }
}
module.exports = new CurrencyService();
