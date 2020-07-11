const Currency = require('./currency.model');

const currencyErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Валюту не знайдено' },
  { lang: 'eng', value: 'Currency not found' },
]);
class CurrencyService {
  async getAllCurrencies() {
    return await Currency.find() || new Error(currencyErrorMessage);
  }

  async getCurrencyById(id) {
    return await Currency.findById(id) || new Error(currencyErrorMessage);
  }

  async updateCurrency(id, currency) {
    return await Currency.findByIdAndUpdate(id, currency) || new Error(currencyErrorMessage);
  }

  async addCurrency(data) {
    const currency = new Currency(data);
    await currency.save();
    return currency;
  }

  async deleteCurrency(id) {
    return !(await Currency.findByIdAndDelete(id))?new Error('Валюту не знайдено'):null
  }
}
module.exports = new CurrencyService();
