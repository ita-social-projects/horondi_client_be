const Currency = require('../../models/Currency');

class CurrencyService {
  getAllCurrencies() {
    return Currency.find();
  }

  getCurrencyById(id) {
    return Currency.findById(id);
  }

  addCurrency(data) {
    const currency = new Currency(data);
    currency.save();
    return currency;
  }

  deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrencyService();
