const Currency = require('./currencies.service');

const currencyQuery = {
  getAllCurrencies: () => Currency.getAllCurrencies(),
  getCurrencyById: (parent, args) => Currency.getCurrencyById(args.id),
};

module.exports = currencyQuery;
