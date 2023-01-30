const deliveryService = require('./ukr-poshta.service');
const RuleError = require('../../../errors/rule.error');

const ukrPoshtaQuery = {
  getUkrPoshtaRegions: async () => {
    try {
      return await deliveryService.getUkrPoshtaRegions();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getUkrPoshtaDistrictsByRegionId: async (_parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaDistrictsByRegionId(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getUkrPoshtaCitiesByDistrictId: async (_parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaCitiesByDistrictId(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getUkrPoshtaStreetsByCityId: async (_parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaStreetsByCityId(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getUkrPoshtaPostofficesCityId: async (_parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaPostofficesCityId(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { ukrPoshtaQuery };
