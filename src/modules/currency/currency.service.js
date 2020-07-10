const Currency = require('./currency.model');

const currencyErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Валюту не знайдено' },
  { lang: 'eng', value: 'Currency not found' },
]);
class CurrencyService {
  async getAllCurrencies() {
    const currencies = await Currency.find();
    if (currencies) {
      return currencies;
    }
    return new Error(currencyErrorMessage);
  }

  async getCurrencyById(id) {
    const currency = await Currency.findById(id);
    if (currency) {
      return currency;
    }
    return new Error(currencyErrorMessage);
  }

  async updateCurrency(id, currency) {
    const currencyToUpdate = await Currency.findByIdAndUpdate(id, currency);
    if (currencyToUpdate) {
      return currencyToUpdate;
    }
    return new Error(currencyErrorMessage);
  }

  async addCurrency(data) {
    const currency = new Currency(data);
    await currency.save();
    return currency;
  }

  async deleteCurrency(id) {
    const currency = await Currency.findByIdAndDelete(id);
    if (!currency) {
      return { message: 'Валюту не знайдено' };
    }
  }
}
module.exports = new CurrencyService();
