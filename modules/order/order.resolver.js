const ordersService = require('./order.service');
const RuleError = require('../../errors/rule.error');

const ordersQuery = {
  getOrderById: async (parent, { id }) => {
    try {
      return await ordersService.getOrderById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getAllOrders: async (_, args) => ordersService.getAllOrders(args),
  getUserOrders: async (_, { pagination }, { user }) => {
    try {
      return await ordersService.getUserOrders(pagination, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getOrdersStatistic: (_, { date }) => ordersService.getOrdersStatistic(date),
  getPaidOrdersStatistic: (_, { date }) =>
    ordersService.getPaidOrdersStatistic(date),
  getOrderByPaidOrderNumber: async (_, { paidOrderNumber }) => {
    try {
      return await ordersService.getOrderByPaidOrderNumber(paidOrderNumber);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const ordersMutation = {
  addOrder: async (_, { order }, { user }) => {
    try {
      return await ordersService.addOrder(order, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteOrder: async (_, { id }) => {
    try {
      return await ordersService.deleteOrder(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateOrder: async (_, { order, id }) => {
    try {
      return await ordersService.updateOrder(order, id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { ordersQuery, ordersMutation };
