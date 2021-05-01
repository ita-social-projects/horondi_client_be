const currencyService = require('./currency.service');
const RuleError = require('../../errors/rule.error');
const {
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const currencyQuery = {
  getAllCurrencies: async () => {
    try {
      return await currencyService.getAllCurrencies();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCurrencyById: async (parent, args) => {
    try {
      return await currencyService.getCurrencyById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const currencyMutation = {
  addCurrency: async (parent, args) => {
    try {
      return await currencyService.addCurrency(args.currency);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteCurrency: async (parent, args) => {
    try {
      return await currencyService.deleteCurrency(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateCurrency: async (parent, args) => {
    try {
      return await currencyService.updateCurrency(args.id, args.currency);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { currencyQuery, currencyMutation };
