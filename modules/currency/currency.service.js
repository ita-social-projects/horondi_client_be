const Currency = require('./currency.model');

const {
  CURRENCY_ALREADY_EXIST,
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

class CurrencyService {
  constructor() {
    this.currencyTypes = {
      UAH: 'UAH',
      USD: 'USD',
    };
  }

  async getAllCurrencies() {
    return Currency.find();
  }

  async getCurrencyById(id) {
    const foundCurrency = Currency.findById(id);
    if (foundCurrency) {
      return foundCurrency;
    }
    throw new Error(CURRENCY_NOT_FOUND);
  }

  async updateCurrency(id, currency) {
    const currencyToUpdate = Currency.findById(id);
    if (!currencyToUpdate) {
      throw new Error(CURRENCY_NOT_FOUND);
    }
    if (await this.checkCurrencyExist(currency, id)) {
      throw new Error(CURRENCY_ALREADY_EXIST);
    }
    return Currency.findByIdAndUpdate(id, currency, {
      new: true,
    });
  }

  async addCurrency(data) {
    if (await this.checkCurrencyExist(data)) {
      throw new Error(CURRENCY_ALREADY_EXIST);
    }
    return new Currency(data).save();
  }

  async deleteCurrency(id) {
    const foundCurrency = Currency.findByIdAndDelete(id);
    if (foundCurrency) {
      return foundCurrency;
    }
    throw new Error(CURRENCY_NOT_FOUND);
  }

  async deleteAllCurrencies() {
    Currency.deleteMany({});
  }

  async checkCurrencyExist(data, id) {
    const currenciesCount = Currency.countDocuments({
      _id: { $ne: id },
      convertOptions: {
        $elemMatch: {
          $or: [
            { name: data.convertOptions[0].name },
            { name: data.convertOptions[1].name },
          ],
        },
      },
    });
    return currenciesCount > 0;
  }
}
module.exports = new CurrencyService();
