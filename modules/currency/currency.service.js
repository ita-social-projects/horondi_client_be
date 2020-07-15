const Currency = require('./currency.model');

const currencyErrorMessage = JSON.stringify([
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
    return (await Currency.find()) || new Error(currencyErrorMessage);
  }

  async getCurrencyById(id) {
    return (await Currency.findById(id)) || new Error(currencyErrorMessage);
  }

  async updateCurrency(id, currency) {
    return (
      (await Currency.findByIdAndUpdate(id, currency))
      || new Error(currencyErrorMessage)
    );
  }

  async addCurrency(data) {
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    return (
      (await Currency.findByIdAndDelete(id)) || {
        message: 'Валюту не знайдено',
      }
    );
  }
}
module.exports = new CurrencyService();
