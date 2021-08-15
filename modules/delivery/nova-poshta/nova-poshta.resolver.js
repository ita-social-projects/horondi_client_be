const deliveryService = require('./nova-poshta.service');
const RuleError = require('../../../errors/rule.error');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaCities(args.city);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getNovaPoshtaStreets: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaStreets(args.cityRef, args.street);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getNovaPoshtaWarehouses: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaWarehouses(args.city);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getNovaPoshtaPrices: async (parent, args) => {
    try {
      return deliveryService.getNovaPoshtaPrices(args.data);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { novaPoshtaQuery };
