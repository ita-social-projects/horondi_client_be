const deliveryService = require('./nova-poshta.service');

const novaPoshtaQuery = {
  getNovaPoshtaCities: async (parent, args) =>
    deliveryService.getNovaPoshtaCities(args.city),

  getNovaPoshtaStreets: async (parent, args) =>
    deliveryService.getNovaPoshtaStreets(args.cityRef, args.street),

  getNovaPoshtaWarehouses: async (parent, args) =>
    deliveryService.getNovaPoshtaWarehouses(args.city),

  getNovaPoshtaPrices: async (parent, args) =>
    deliveryService.getNovaPoshtaPrices(args.data),
};

module.exports = { novaPoshtaQuery };
