const deliveryService = require('./ukr-poshta.service');
const RuleError = require('../../../errors/rule.error');

const ukrPoshtaQuery = {
  getUkrPoshtaRegions: async () => {
    try {
      return await deliveryService.getUkrPoshtaRegions();
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getUkrPoshtaDistrictsByRegionId: async (parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaDistrictsByRegionId(args.id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getUkrPoshtaCitiesByDistrictId: async (parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaCitiesByDistrictId(args.id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getUkrPoshtaPostofficesCityId: async (parent, args) => {
    try {
      return await deliveryService.getUkrPoshtaPostofficesCityId(args.id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
};

module.exports = { ukrPoshtaQuery };
