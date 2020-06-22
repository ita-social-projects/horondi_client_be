const Currency = require('./currency.model');

class CurrencyService {
  getAllCurrencies() {
    return Currency.find();
  }

  getCurrencyById(id) {
    return Currency.findById(id);
  }

  addCurrency(data) {
    const currency = new Currency(data);
    return currency.save();
  }

  deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrencyService();
