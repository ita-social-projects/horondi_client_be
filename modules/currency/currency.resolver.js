const currencyService = require('./currency.service');
const RuleError = require('../../errors/rule.error');

const currencyQuery = {
  getAllCurrencies: () => currencyService.getAllCurrencies(),
  getCurrencyById: async (_parent, args) => {
    try {
      return await currencyService.getCurrencyById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const currencyMutation = {
  addCurrency: async (_parent, args) => {
    try {
      return await currencyService.addCurrency(args.currency);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteCurrency: async (_parent, args) => {
    try {
      return await currencyService.deleteCurrency(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateCurrency: async (_parent, args) => {
    try {
      return await currencyService.updateCurrency(args.id, args.currency);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { currencyQuery, currencyMutation };
