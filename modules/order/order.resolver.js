const ordersService = require('./order.service');
const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');

const ordersQuery = {
  getOrderById: async (parent, args) => {
    const order = await ordersService.getOrderById(args.id);
    if (order) {
      return order;
    }
    return new RuleError(e.message, e.statusCode);
  },
  getAllOrders: async (parent, args) => {
    try {
      return await ordersService.getAllOrders(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getUserOrders: async (parent, args, context) => {
    try {
      return await ordersService.getUserOrders(context.user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getOrdersStatistic: async (parent, args) => {
    try {
      return await ordersService.getOrdersStatistic(args.date);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPaidOrdersStatistic: async (parent, args) => {
    try {
      return await ordersService.getPaidOrdersStatistic(args.date);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getOrderByPaidOrderNumber: async (_, { paidOrderNumber }) => {
    try {
      return await ordersService.getOrderByPaidOrderNumber(paidOrderNumber);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const ordersMutation = {
  addOrder: async (parent, args) => {
    try {
      return await ordersService.addOrder(args.order);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteOrder: async (parent, args) => {
    const deletedOrder = await ordersService.deleteOrder(args.id);
    if (deletedOrder) {
      return deletedOrder;
    }
    return new RuleError(e.message, e.statusCode);
  },
  updateOrder: async (parent, args) => {
    try {
      return await ordersService.updateOrder(args.order, args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { ordersQuery, ordersMutation };
