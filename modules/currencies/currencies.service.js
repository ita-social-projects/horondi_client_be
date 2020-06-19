const Currency = require('../../models/Currency');

class CurrenciesService {
  getAllCurrencies() {
    return Currency.find();
  }

  getCurrencyById(id) {
    return Currency.findById(id);
  }

  async addCurrency(data) {
    const currency = await new Currency(data);
    await currency.save();
    return currency;
  }

  deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrenciesService();
