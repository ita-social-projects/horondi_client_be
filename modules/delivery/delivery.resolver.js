const deliveryService = require('./delivery.service');
const {
  ORDER_CREATION_FAILED,
} = require('../../error-messages/delivery.message');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) =>
    await deliveryService.getNovaPoshtaCities(args.city),

  getNovaPoshtaStreets: async (parent, args) =>
    await deliveryService.getNovaPoshtaStreets(args.cityRef, args.street),

  getNovaPoshtaWarehouses: async (parent, args) =>
    await deliveryService.getNovaPoshtaWarehouses(args.city),

  getNovaPoshtaPrices: async (parent, args) =>
    await deliveryService.getNovaPoshtaPrices(args.data),

  createNovaPoshtaOrder: async (parent, args) => {
    try {
      return await deliveryService.createNovaPoshtaOrder(args.data);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
};

const ukrPoshtaQuery = {
  getUkrPoshtaRegion: async (parent, args) =>
    await deliveryService.getUkrPoshtaRegion(args.region),
};

module.exports = { novaPoshtaQuery, ukrPoshtaQuery };
