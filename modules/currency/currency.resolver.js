const { currencyService } = require('./currency.service');
const {
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

const currencyQuery = {
  getAllCurrencies: () => currencyService.getAllCurrencies(),
  getCurrencyById: async (parent, args) => {
    try {
      return await currencyService.getCurrencyById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const currencyMutation = {
  addCurrency: async (parent, args) => {
    try {
      return await currencyService.addCurrency(args.currency);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteCurrency: async (parent, args) => {
    try {
      return await currencyService.deleteCurrency(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateCurrency: async (parent, args) => {
    try {
      return await currencyService.updateCurrency(args.id, args.currency);
    } catch (e) {
      return {
        statusCode: e.message === CURRENCY_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { currencyQuery, currencyMutation };
