const Currency = require('../../models/Currency');

class CurrenciesService {
  getAllCurrencies() {
    return Currency.find();
  }

  getCurrencyById(id) {
    return Currency.findById(id);
  }

  async addCurrency(data) {
    const category = await Currency(data);
    await category.save();
  }

  deleteCurrency(id) {
    return Currency.findByIdAndDelete(id);
  }
}
module.exports = new CurrenciesService();
