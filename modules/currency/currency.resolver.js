const currencyService = require('./currency.service');

const currencyQuery = {
  getAllCurrencies: () => currencyService.getAllCurrencies(),
  getCurrencyById: (parent, args) => currencyService.getCurrencyById(args.id),
};

const currencyMutation = {
  addCurrency: (parent, args) => currencyService.addCurrency(args.currency),
  deleteCurrency: (parent, args) => currencyService.deleteCurrency(args.id),
  updateCurrency: (parent, args) => currencyService.updateCurrency(args.id, args.currency),
};

module.exports = { currencyQuery, currencyMutation };
