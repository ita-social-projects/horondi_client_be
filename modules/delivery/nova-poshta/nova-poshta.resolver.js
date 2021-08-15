const deliveryService = require('./nova-poshta.service');
const RuleError = require('../../../errors/rule.error');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaCities(args.city);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaStreets: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaStreets(args.cityRef, args.street);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaWarehouses: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaWarehouses(args.city);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getNovaPoshtaPrices: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaPrices(args.data);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
};

module.exports = { novaPoshtaQuery };
