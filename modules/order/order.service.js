const { ObjectId } = require('mongoose').Types;

const Currency = require('../currency/currency.model');
const RuleError = require('../../errors/rule.error');
const Order = require('./order.model');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const { userDateFormat } = require('../../consts');
const { minDefaultDate } = require('../../consts/date-range');

const {
  removeDaysFromData,
  countItemsOccurrence,
  changeDataFormat,
  reduceByDaysCount,
} = require('../helper-functions');

const {
  calculateTotalPriceToPay,
  calculateTotalItemsPrice,
  generateOrderNumber,
  addProductsToStatistic,
  updateProductStatistic,
  calculateProductsPriceWithDiscount,
} = require('../../utils/order.utils');

class OrdersService {
  async getAllOrders({ skip, limit, filter = {}, sort }) {
    let maxDate = new Date();
    let minDate = minDefaultDate;

    if (!Object.keys(sort).length) {
      sort.dateOfCreation = -1;
    }
    const { status, paymentStatus, date, search } = filter;
    const filterObject = {};

    if (status?.length) {
      filterObject.status = { $in: status };
    }

    if (paymentStatus?.length) {
      filterObject.paymentStatus = { $in: paymentStatus };
    }

    if (date?.dateFrom) {
      minDate = new Date(date.dateFrom);
    }

    if (date?.dateTo) {
      maxDate = new Date(date.dateTo);
    }

    filterObject.dateOfCreation = {
      $gte: minDate,
      $lte: maxDate,
    };

    if (search) {
      const [firstParam, secondParam] = search.trim().split(' ');

      filterObject.$or = [
        {
          'user.firstName': {
            $regex: `${firstParam || secondParam}`,
            $options: 'i',
          },
        },
        {
          'user.lastName': {
            $regex: `${firstParam || secondParam}`,
            $options: 'i',
          },
        },
        {
          orderNumber: {
            $regex: `${firstParam || secondParam}`,
            $options: 'i',
          },
        },
      ];
    }
    const items = await Order.find(filterObject)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = Order.find(filterObject).countDocuments();

    return {
      items,
      count,
    };
  }

  async getOrdersByUser(filter, skip, limit, sort, userId) {
    let maxDate = new Date();
    let minDate = minDefaultDate;

    if (!Object.keys(sort).length) {
      sort.dateOfCreation = -1;
    }

    const { status, paymentStatus, date } = filter;
    const filterObject = {};

    filterObject.user_id = userId;

    if (status?.length) {
      filterObject.status = { $in: status };
    }

    if (paymentStatus?.length) {
      filterObject.paymentStatus = { $in: paymentStatus };
    }

    if (date?.dateFrom) {
      minDate = new Date(date.dateFrom);
    }

    if (date?.dateTo) {
      maxDate = new Date(date.dateTo);
    }

    filterObject.dateOfCreation = {
      $gte: minDate,
      $lte: maxDate,
    };

    const items = await Order.find(filterObject)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = Order.find(filterObject).countDocuments();

    return {
      items,
      count,
    };
  }

  async getOrderById(id) {
    const foundOrder = await Order.findById(id).exec();

    if (!foundOrder) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }

    return foundOrder;
  }

  async updateOrder(order, id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);
    }

    const orderToUpdate = await Order.findById(id).exec();

    if (!orderToUpdate) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }

    const { items } = order;

    const userId = orderToUpdate?.user_id;

    const data = { ...order, user_id: userId || null };

    await updateProductStatistic(orderToUpdate, data);

    const totalItemsPrice = await calculateTotalItemsPrice(items);
    let totalPriceToPay = totalItemsPrice;

    const { convertOptions } = await Currency.findOne().exec();
    const { exchangeRate } = convertOptions.UAH;

    const {
      discounts: itemsDiscount,
      priceWithDiscount: itemsPriceWithDiscount,
    } = await calculateProductsPriceWithDiscount(data.promoCodeId, data.certificateId, items);

    if (data.promoCodeId) {
      totalPriceToPay = await calculateTotalPriceToPay(itemsPriceWithDiscount);
    }

    if (data.certificateId) {
      totalPriceToPay = await calculateTotalPriceToPay(itemsPriceWithDiscount) - (itemsDiscount / exchangeRate);;
    }

    const orderUpdate = {
      ...order,
      totalItemsPrice,
      itemsPriceWithDiscount,
      itemsDiscount,
      totalPriceToPay,
    };

    return Order.findByIdAndUpdate(
      id,
      { ...orderUpdate, lastUpdatedDate: Date.now() },
      { new: true }
    ).exec();
  }

  async addOrder(order, user) {
    const { items } = order;

    const data = { ...order, user_id: user ? user._id : null };
    await addProductsToStatistic(items);

    const totalItemsPrice = await calculateTotalItemsPrice(items);
    const orderNumber = generateOrderNumber();
    let totalPriceToPay = totalItemsPrice;

    const { convertOptions } = await Currency.findOne().exec();
    const { exchangeRate } = convertOptions.UAH;

    const {
      discounts: itemsDiscount,
      priceWithDiscount: itemsPriceWithDiscount,
    } = await calculateProductsPriceWithDiscount(data.promoCodeId, data.certificateId, items);

    if (data.promoCodeId) {
      totalPriceToPay = calculateTotalPriceToPay(itemsPriceWithDiscount);
    }

    if (data.certificateId) {
      totalPriceToPay = calculateTotalPriceToPay(itemsPriceWithDiscount) - (itemsDiscount / exchangeRate);
    }

    const newOrder = {
      ...data,
      totalItemsPrice,
      totalPriceToPay,
      itemsPriceWithDiscount,
      itemsDiscount,
      orderNumber,
      fixedExchangeRate: exchangeRate,
    };

    return new Order(newOrder).save();
  }

  async deleteOrder(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);
    }

    const foundOrder = await Order.findByIdAndDelete(id).exec();

    if (!foundOrder) {
      throw new RuleError(ORDER_NOT_FOUND, NOT_FOUND);
    }

    return foundOrder;
  }

  async getUserOrders({ skip, limit }, { id }) {
    const userOrders = await Order.find({ user_id: id })
      .limit(limit)
      .skip(skip)
      .exec();
    if (!userOrders) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }
    const ordersCount = await Order.find({ user_id: id })
      .countDocuments()
      .exec();

    return { userOrders, ordersCount };
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
    const ordersOccurrence = countItemsOccurrence(orders);
    const counts = Object.values(ordersOccurrence);
    const names = Object.keys(ordersOccurrence);

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
    const orders = await Order.find(filter).lean().exec();
    const statuses = orders.map(({ status }) => status);
    const { names, counts } = this.getOrdersStats(statuses);
    const relations = counts.map(count =>
      Math.round((count * 100) / orders.length)
    );

    return { names, counts, relations };
  }
}

module.exports = new OrdersService();
