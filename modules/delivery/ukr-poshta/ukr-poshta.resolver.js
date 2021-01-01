const deliveryService = require('./ukr-poshta.service');
const {
  ORDER_CREATION_FAILED,
} = require('../../../error-messages/delivery.message');

const ukrPoshtaQuery = {
  createUkrPoshtaOrder: async (parent, args) => {
    return await deliveryService.createUkrPoshtaOrder(args.client, args.order);
  },
};

module.exports = { ukrPoshtaQuery };
