const ordersService = require('./order.service');
const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');

const ordersQuery = {
  getOrderById: async (parent, { id }) => {
    const order = await ordersService.getOrderById(id);
    if (order) {
      return order;
    }
    return {
      statusCode: NOT_FOUND,
      message: ORDER_NOT_FOUND,
    };
  },
  getAllOrders: async (_, args) => await ordersService.getAllOrders(args),
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
    const deletedOrder = await ordersService.deleteOrder(id);
    if (deletedOrder) {
      return deletedOrder;
    }
    return {
      statusCode: NOT_FOUND,
      message: ORDER_NOT_FOUND,
    };
  },
  updateOrder: async (_, { order, id }) => {
    try {
      return await ordersService.updateOrder(order, id);
    } catch (e) {
      return {
        statusCode: e.message === ORDER_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { ordersQuery, ordersMutation };
