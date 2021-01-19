const Order = require('./order.model');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const NovaPoshtaService = require('../delivery/delivery.service');
const ObjectId = require('mongoose').Types.ObjectId;
const Currency = require('../currency/currency.model');
const Product = require('../product/product.model');
const ConstructorBasic = require('../constructor/constructor-basic/constructor-basic.model');
const ConstructorFrontPocket = require('../constructor/constructor-front-pocket/constructor-front-pocket.model');
const ConstructorBottom = require('../constructor/constructor-bottom/constructor-bottom.model');
const Size = require('../size/size.model');
const { populateOrder } = require('./order.utils');

const {
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
  reduceByDaysCount,
} = require('../helper-functions');

const { userDateFormat } = require('../../consts');

class OrdersService {
  async calculateOrderPrice(items) {
    return items.reduce(
      async (prev, item) => {
        console.log(!item.fixedPrice?.length);
        const sum = await prev;
        const { quantity } = item;
        if (!item.fixedPrice?.length) {
          console.log('in');
          const { additionalPrice } = await Size.findById(item.options.size);
          if (item.isFromConstructor) {
            const constructorBasics = await ConstructorBasic.findById(
              item.constructorBasics
            );
            const constructorFrontPocket = await ConstructorFrontPocket.findById(
              item.constructorFrontPocket
            );
            const constructorBottom = await ConstructorBottom.findById(
              item.constructorBottom
            );
            item.fixedPrice = [
              {
                currency: 'UAH',
                value:
                  (constructorBasics.basePrice[0].value +
                    constructorFrontPocket.basePrice[0].value +
                    constructorBottom.basePrice[0].value +
                    additionalPrice[0].value) *
                  quantity,
              },
              {
                currency: 'USD',
                value:
                  (constructorBasics.basePrice[1].value +
                    constructorFrontPocket.basePrice[1].value +
                    constructorBottom.basePrice[1].value +
                    additionalPrice[1].value) *
                  quantity,
              },
            ];
          } else {
            const { basePrice } = await Product.findById(item.product);
            item.fixedPrice = [
              {
                currency: 'UAH',
                value: basePrice[0].value + additionalPrice[0].value,
              },
              {
                currency: 'USD',
                value: basePrice[1].value + additionalPrice[1].value,
              },
            ];
          }
        }
        return [
          {
            currency: 'UAH',
            value: item.fixedPrice[0].value * quantity + sum[0].value,
          },
          {
            currency: 'USD',
            value: item.fixedPrice[1].value * quantity + sum[1].value,
          },
        ];
      },
      [
        {
          currency: 'UAH',
          value: 0,
        },
        {
          currency: 'USD',
          value: 0,
        },
      ]
    );
  }

  async calculateTotalPriceToPay({ delivery }, totalItemsPrice) {
    return [
      {
        currency: 'UAH',
        value: totalItemsPrice[0].value + delivery.cost[0].value,
      },
      {
        currency: 'USD',
        value: totalItemsPrice[1].value + delivery.cost[1].value,
      },
    ];
  }

  async getAllOrders({ skip, limit, filter = {} }) {
    const { orderStatus } = filter;

    const filters = orderStatus ? { status: { $in: orderStatus } } : {};

    const items = await populateOrder(Order.find(filters))
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
    if (!ObjectId.isValid(id)) {
      throw new Error(ORDER_NOT_VALID);
    }
    const foundOrder = await populateOrder(Order.findById(id));
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }

  async updateOrder(order, id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ORDER_NOT_VALID);
    }
    const orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
      throw new Error(ORDER_NOT_FOUND);
    }

    if (order.items || order.delivery || order.address) {
      const totalItemsPrice = await this.calculateOrderPrice(order.items);

      if (
        orderToUpdate.delivery.sentBy !== 'Nova Poshta' &&
        order.delivery.sentBy === 'Nova Poshta'
      ) {
        const weight = order.items.reduce(
          (prev, currentItem) =>
            prev + currentItem.size.weightInKg * currentItem.quantity,
          0
        );
        const cityRecipient = await NovaPoshtaService.getNovaPoshtaCities(
          order.address.city
        );

        const deliveryPrice = await NovaPoshtaService.getNovaPoshtaPrices({
          cityRecipient: cityRecipient[0].ref,
          weight,
          serviceType: order.delivery.byCourier
            ? 'WarehouseDoors'
            : 'WarehouseWarehouse',
          cost: totalItemsPrice[0].value / 100,
        });

        const currency = await Currency.findOne();

        const cost = [
          {
            currency: 'UAH',
            value: deliveryPrice[0].cost * 100,
          },
          {
            currency: 'USD',
            value: Math.round(
              (deliveryPrice[0].cost /
                currency.convertOptions[0].exchangeRate) *
                100
            ),
          },
        ];

        order = {
          ...order,
          delivery: {
            ...order.delivery,
            cost,
          },
        };
      }

      const totalPriceToPay = await this.calculateTotalPriceToPay(
        order,
        totalItemsPrice
      );

      order = {
        ...order,
        totalItemsPrice,
        totalPriceToPay,
      };
    }

    return await Order.findByIdAndUpdate(
      id,
      { ...order, lastUpdatedDate: Date.now() },
      {
        new: true,
      }
    );
  }

  async addOrder(data) {
    const { items } = data;
    const totalItemsPrice = await this.calculateOrderPrice(items);

    if (data.delivery.sentBy === 'Nova Poshta') {
      const weight = data.items.reduce(
        (prev, currentItem) =>
          prev + currentItem.size.weightInKg * currentItem.quantity,
        0
      );
      const cityRecipient = await NovaPoshtaService.getNovaPoshtaCities(
        data.address.city
      );

      const deliveryPrice = await NovaPoshtaService.getNovaPoshtaPrices({
        cityRecipient: cityRecipient[0].ref,
        weight,
        serviceType: data.delivery.byCourier
          ? 'WarehouseDoors'
          : 'WarehouseWarehouse',
        cost: totalItemsPrice[0].value / 100,
      });

      const currency = await Currency.findOne();

      const cost = [
        {
          currency: 'UAH',
          value: deliveryPrice[0].cost * 100,
        },
        {
          currency: 'USD',
          value: Math.round(
            (deliveryPrice[0].cost / currency.convertOptions[0].exchangeRate) *
              100
          ),
        },
      ];

      data = {
        ...data,
        delivery: {
          ...data.delivery,
          cost,
        },
      };
    }

    const totalPriceToPay = await this.calculateTotalPriceToPay(
      data,
      totalItemsPrice
    );

    const order = {
      ...data,
      totalItemsPrice,
      totalPriceToPay,
      lastUpdatedDate: Date.now(),
    };
    return new Order(order).save();
  }

  async deleteOrder(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ORDER_NOT_VALID);
    }
    const foundOrder = await Order.findByIdAndDelete(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }

  async getUserOrders(user) {
    const { orders } = user;

    return await populateOrder(Order.find({ _id: orders }));
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
