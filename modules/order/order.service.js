const Order = require('./order.model');
const ObjectId = require('mongoose').Types.ObjectId;

const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');

const { userDateFormat } = require('../../consts');

const {
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
  calculateTotalItemsPrice,
  calculateTotalPriceToPay,
  reduceByDaysCount,
} = require('../helper-functions');

class OrdersService {
  async getAllOrders({ skip, limit, filter = {} }) {
    const { orderStatus } = filter;

    const filters = orderStatus ? { status: { $in: orderStatus } } : {};

    const items = await Order.find(filters)
      .sort({ dateOfCreation: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Order.find(filters).countDocuments();
    return {
      items,
      count,
    };
  }

  async getOrderById(id) {
    if (!ObjectId.isValid(id)) throw new Error(ORDER_NOT_VALID);

    const foundOrder = await Order.findById(id);
    if (!foundOrder) throw new Error(ORDER_NOT_FOUND);

    return foundOrder;
  }

  async updateOrder(order) {
    if (!ObjectId.isValid(order._id)) throw new Error(ORDER_NOT_VALID);

    const orderToUpdate = await Order.findById(order._id);

    if (!orderToUpdate) throw new Error(ORDER_NOT_FOUND);

    const { items } = order;

    const lastUpdatedDate = Date.now();
    const totalItemsPrice = calculateTotalItemsPrice(items);
    const totalPriceToPay = calculateTotalPriceToPay(order);

    const updatedOrder = {
      ...order,
      lastUpdatedDate,
      totalItemsPrice,
      totalPriceToPay,
    };

    return await Order.findByIdAndUpdate(
      order._id,
      { updatedOrder },
      { new: true }
    );
  }

  async addOrder(data) {
    const { items } = data;
    const totalItemsPrice = calculateTotalItemsPrice(items);
    const status = 'CREATED';
    const dateOfCreation = Date.now();
    const lastUpdatedDate = Date.now();
    const isPaid = false;

    const order = {
      ...data,
      status,
      totalItemsPrice,
      dateOfCreation,
      isPaid,
      lastUpdatedDate,
    };

    const totalPriceToPay = calculateTotalPriceToPay(order);

    const _order = {
      ...order,
      totalPriceToPay,
    };

    return new Order(_order).save();
  }

  async deleteOrder(id) {
    if (!ObjectId.isValid(id)) throw new Error(ORDER_NOT_VALID);

    const foundOrder = await Order.findByIdAndDelete(id);

    if (!foundOrder) throw new Error(ORDER_NOT_FOUND);
    return foundOrder;
  }

  async getUserOrders(user) {
    const { orders } = user;

    return await Order.find({ _id: orders });
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
      .lean();
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
    const orders = await Order.find(filter).lean();
    const statuses = orders.map(({ status }) => status);
    const { names, counts } = this.getOrdersStats(statuses);
    const relations = counts.map(count =>
      Math.round((count * 100) / orders.length)
    );

    return { names, counts, relations };
  }
}

module.exports = new OrdersService();
