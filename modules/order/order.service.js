const ObjectId = require('mongoose').Types.ObjectId;

const RuleError = require('../../errors/rule.error');
const Order = require('./order.model');
const {
  ORDER_PAYMENT_STATUS: { PAID },
} = require('../../consts/order-payment-status');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
  ORDER_IS_NOT_PAID,
} = require('../../error-messages/orders.messages');
const {
  userDateFormat,
  roles: { USER },
} = require('../../consts');

const {
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
  reduceByDaysCount,
} = require('../helper-functions');

const {
  calculateTotalPriceToPay,
  calculateTotalItemsPrice,
  generateOrderNumber,
  addProductsToStatistic,
  updateProductStatistic,
} = require('../../utils/order.utils');

class OrdersService {
  async getOrderByPaidOrderNumber(orderNumber) {
    const order = await Order.findOne({ orderNumber }).exec();

    if (!order) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

    return order;
  }

  async getAllOrders({ skip, limit, filter = {} }) {
    const { orderStatus } = filter;

    const filters = orderStatus ? { status: { $in: orderStatus } } : {};

    const items = await Order.find(filters)
      .sort({ dateOfCreation: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Order.find(filters).countDocuments();
    return {
      items,
      count,
    };
  }

  async getOrderById(id) {
    if (!ObjectId.isValid(id)) throw new Error(ORDER_NOT_VALID);

    const foundOrder = await Order.findById(id).exec();
    if (!foundOrder) throw new Error(ORDER_NOT_FOUND);

    return foundOrder;
  }

  async updateOrder(order, id) {
    if (!ObjectId.isValid(id)) throw new Error(ORDER_NOT_VALID);

    const orderToUpdate = await Order.findById(id).exec();

    if (!orderToUpdate) throw new Error(ORDER_NOT_FOUND);

    const { items } = order;

    await updateProductStatistic(orderToUpdate, order);

    const totalItemsPrice = await calculateTotalItemsPrice(items);
    const totalPriceToPay = await calculateTotalPriceToPay(
      order,
      totalItemsPrice
    );

    order = {
      ...order,
      totalItemsPrice,
      totalPriceToPay,
    };

    return await Order.findByIdAndUpdate(
      id,
      { ...order, lastUpdatedDate: Date.now() },
      { new: true }
    ).exec();
  }

  async addOrder(data, user) {
    const { items } = data;

    await addProductsToStatistic(items);

    const totalItemsPrice = await calculateTotalItemsPrice(items);
    const orderNumber = generateOrderNumber();

    const totalPriceToPay = await calculateTotalPriceToPay(
      data,
      totalItemsPrice
    );

    const order = {
      ...data,
      totalItemsPrice,
      totalPriceToPay,
      orderNumber,
    };

    return new Order(order).save();
  }

  async deleteOrder(id) {
    if (!ObjectId.isValid(id)) throw new Error(ORDER_NOT_VALID);

    const foundOrder = await Order.findByIdAndDelete(id).exec();

    if (!foundOrder) throw new Error(ORDER_NOT_FOUND);
    return foundOrder;
  }

  async getUserOrders(user) {
    const { orders } = user;

    return await Order.find({ _id: orders }).exec();
  }

  filterOrders({ days, isPaid }) {
    const filter = {};

    if (days) {
      const currentDate = Date.now();
      filter.dateOfCreation = {
        $gte: removeDaysFromData(days, currentDate),
        $lte: removeDaysFromData(0, currentDate),
      };
    }

    if (isPaid) {
      filter.isPaid = isPaid;
    }

    return filter;
  }

  getOrdersStats(orders) {
    const ordersOccurency = countItemsOccurency(orders);
    const counts = Object.values(ordersOccurency);
    const names = Object.keys(ordersOccurency);

    return { counts, names };
  }

  async getPaidOrdersStatistic(days) {
    const filter = this.filterOrders({ days, isPaid: true });
    const orders = await Order.find(filter)
      .sort({ dateOfCreation: 1 })
      .lean()
      .exec();
    const formattedDate = orders.map(({ dateOfCreation }) =>
      changeDataFormat(dateOfCreation, userDateFormat)
    );
    const { names, counts } = this.getOrdersStats(formattedDate);
    const total = counts.reduce(
      (orderTotal, orderCount) => orderTotal + orderCount,
      0
    );
    const { labels, count } = reduceByDaysCount(names, counts, days);

    return { labels, counts: count, total };
  }

  async getOrdersStatistic(days) {
    const filter = this.filterOrders({ days });
    const orders = await Order.find(filter)
      .lean()
      .exec();
    const statuses = orders.map(({ status }) => status);
    const { names, counts } = this.getOrdersStats(statuses);
    const relations = counts.map(count =>
      Math.round((count * 100) / orders.length)
    );

    return { names, counts, relations };
  }
}

module.exports = new OrdersService();
