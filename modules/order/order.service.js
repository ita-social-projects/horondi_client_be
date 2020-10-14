const Order = require('./order.model');

const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const NovaPoshtaService = require('../delivery/delivery.service');
const ObjectId = require('mongoose').Types.ObjectId;
const Currency = require('../currency/currency.model');

class OrdersService {
  calculateTotalItemsPrice(items) {
    return items.reduce(
      (previousPrice, currentItem) => {
        const { actualPrice, quantity } = currentItem;

        return [
          {
            currency: 'UAH',
            value: actualPrice[0].value * quantity + previousPrice[0].value,
          },
          {
            currency: 'USD',
            value: actualPrice[1].value * quantity + previousPrice[1].value,
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

  calculateTotalPriceToPay({ delivery }, totalItemsPrice) {
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

  async getAllOrders() {
    return await Order.find();
  }

  async getOrderById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ORDER_NOT_VALID);
    }
    const foundOrder = await Order.findById(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }

  async updateOrder(id, order) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ORDER_NOT_VALID);
    }
    const orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
      throw new Error(ORDER_NOT_FOUND);
    }

    if (order.items || order.delivery || order.address) {
      const totalItemsPrice = this.calculateTotalItemsPrice(order.items);

      if (order.delivery.sentBy == 'Nova Poshta') {
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

      const totalPriceToPay = this.calculateTotalPriceToPay(
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

    const totalItemsPrice = this.calculateTotalItemsPrice(items);

    if (data.delivery.sentBy == 'Nova Poshta') {
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

    const totalPriceToPay = this.calculateTotalPriceToPay(
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

    return await Order.find({ _id: orders });
  }
}
module.exports = new OrdersService();
