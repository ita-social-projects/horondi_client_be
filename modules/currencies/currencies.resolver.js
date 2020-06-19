const Currency = require('./currencies.service');

const currencyQuery = {
  getAllCurrencies: () => Currency.getAllCurrencies(),
  getCurrencyById: (parent, args) => Currency.getCurrencyById(args.id),
};

const currencyMutation = {
  addCurrency: (parent, args) => Currency.addCurrency(args.currency),
  deleteCurrency: (parent, args) => Currency.deleteCurrency(args.id),
};

module.exports = { currencyQuery, currencyMutation };
