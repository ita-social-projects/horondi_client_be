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
  addCurrency: async (parent, args) => {
    try {
      await currencyService.addCurrency(args.currency);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
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
  updateCurrency: async (parent, args) => {
    const currency = await currencyService.updateCurrency(
      args.id,
      args.currency,
    );
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
