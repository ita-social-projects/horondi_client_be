const Currency = require('./currencies.service');

const CurrencyQuery = {
  getAllCurrencies: () => Currency.getAllCurrencies(),
  getCurrencyById: (parent, args) => Currency.getCurrencyById(args.id),
};

const CurrencyMutation = {
  addCurrency: (parent, args) => Currency.addCurrency(args.currency),
  deleteCurrency: (parent, args) => Currency.deleteCurrency(args.id),
};

module.exports = { CurrencyQuery, CurrencyMutation };
