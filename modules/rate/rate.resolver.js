const ratesService = require('./rate.service');

const ratesQuery = {
  getAllRates: () => ratesService.getAllRates(),
  getRateById: (parent, args) => ratesService.getRateById(args.id),
  getAllRatesByProduct: (parent, args) => ratesService.getAllRatesByProduct(args.id),
};

const ratesMutation = {
  addRate: (parent, args) => ratesService.addRate(args.rate),
  deleteRate: (parent, args) => ratesService.deleteRate(args.id),
  updateRate: (parent, args) => ratesService.updateRate(args.id, args.rate),
};

module.exports = { ratesQuery, ratesMutation };
