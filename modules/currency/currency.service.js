const Currency = require('./currency.model');

class CurrencyService {
  getAllCurrencies() {
    return Currency.find();
  }

  getCurrencyById(id) {
    return Currency.findById(id);
  }

  updateCurrency(id, currency) {
    return Currency.findByIdAndUpdate(id, currency);
  }

  async addCurrency(data) {
    const currency = new Currency(data);
    return await currency.save();
  }

  deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrencyService();
