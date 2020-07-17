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
class CurrencyService {
  async getAllCurrencies() {
    const currency = await Currency.find();
    return currency;
  }

  async getCurrencyById(id) {
    return (await Currency.findById(id)) || new Error(CURRENCY_NOT_FOUND);
  }

  async updateCurrency(id, currency) {
    return (
      (await Currency.findByIdAndUpdate(id, currency))
      || new Error(CURRENCY_NOT_FOUND)
    );
  }

  async addCurrency(data) {
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    return (
      (await Currency.findByIdAndDelete(id)) || new Error(CURRENCY_NOT_FOUND)
    );
  }
}
module.exports = new CurrencyService();
