const deliveryService = require('./nova-poshta.service');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) =>
    await deliveryService.getNovaPoshtaCities(args.city),

  getNovaPoshtaStreets: async (parent, args) =>
    await deliveryService.getNovaPoshtaStreets(args.cityRef, args.street),

  getNovaPoshtaWarehouses: async (parent, args) =>
    await deliveryService.getNovaPoshtaWarehouses(args.city),

  getNovaPoshtaPrices: async (parent, args) =>
    await deliveryService.getNovaPoshtaPrices(args.data),
};

module.exports = { novaPoshtaQuery };
