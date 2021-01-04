const deliveryService = require('./ukr-poshta.service');
const {
  ORDER_CREATION_FAILED,
} = require('../../../error-messages/delivery.message');

const ukrPoshtaQuery = {
  createUkrPoshtaOrder: async (parent, args) => {
    try {
      const order = await deliveryService.createUkrPoshtaOrder(
        args.client,
        args.order
      );
      console.log(order);
      return order;
    } catch (e) {
      return {
        statusCode: 400,
        message: ORDER_CREATION_FAILED,
      };
    }
  },
  getUkrPoshtaRegions: async () => deliveryService.getUkrPoshtaRegions(),
  getUkrPoshtaDistrictsByRegionId: async (parent, args) =>
    deliveryService.getUkrPoshtaDistrictsByRegionId(args.id),
  getUkrPoshtaCitiesByDistrictId: async (parent, args) =>
    deliveryService.getUkrPoshtaCitiesByDistrictId(args.id),
  getUkrPoshtaPostofficesCityId: async (parent, args) =>
    deliveryService.getUkrPoshtaPostofficesCityId(args.id),
};

module.exports = { ukrPoshtaQuery };
