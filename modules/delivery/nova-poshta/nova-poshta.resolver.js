const RuleError = require('../../../errors/rule.error');
const deliveryService = require('./nova-poshta.service');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) => {
    try {
      return await deliveryService.getNovaPoshtaCities(args.city);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaStreets: async (parent, args) => {
    try {
      return await deliveryService.getNovaPoshtaStreets(
        args.cityRef,
        args.street
      );
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaWarehouses: async (parent, args) => {
    try {
      return await deliveryService.getNovaPoshtaWarehouses(args.city);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaPrices: async (parent, args) =>
    await deliveryService.getNovaPoshtaPrices(args.data),
};

module.exports = { novaPoshtaQuery };
