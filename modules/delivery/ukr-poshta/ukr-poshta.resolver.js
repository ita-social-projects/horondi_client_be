const deliveryService = require('./ukr-poshta.service');

const ukrPoshtaQuery = {
  getUkrPoshtaRegions: async () => deliveryService.getUkrPoshtaRegions(),
  getUkrPoshtaDistrictsByRegionId: async (parent, args) =>
    deliveryService.getUkrPoshtaDistrictsByRegionId(args.id),
  getUkrPoshtaCitiesByDistrictId: async (parent, args) =>
    deliveryService.getUkrPoshtaCitiesByDistrictId(args.id),
  getUkrPoshtaPostofficesCityId: async (parent, args) =>
    deliveryService.getUkrPoshtaPostofficesCityId(args.id),
};

module.exports = { ukrPoshtaQuery };
