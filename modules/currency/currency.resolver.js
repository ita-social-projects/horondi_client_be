const currencyService = require('./currency.service');
const {
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

const currencyQuery = {
  getAllCurrencies: () => currencyService.getAllCurrencies(),
  getCurrencyById: async (parent, args) => {
    const currency = await currencyService.getCurrencyById(args.id);
    if (currency) {
      return currency;
    }
    return {
      statusCode: 404,
      message: CURRENCY_NOT_FOUND,
    };
  },
};

const currencyMutation = {
  addCurrency: (parent, args) => currencyService.addCurrency(args.currency),
  deleteCurrency: async (parent, args) => {
    const currency = await currencyService.deleteCurrency(args.id);
    if (currency) {
      return currency;
    }
    return {
      statusCode: 404,
      message: CURRENCY_NOT_FOUND,
    };
  },
  updateCurrency: (parent, args) => {
    const currency = currencyService.updateCurrency(args.id, args.currency);
    if (currency) {
      return currency;
    }
    return {
      statusCode: 404,
      message: CURRENCY_NOT_FOUND,
    };
  },
};

module.exports = { currencyQuery, currencyMutation };
