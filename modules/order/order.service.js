const Order = require('./order.model');
const {
  ORDER_NOT_FOUND,
} = require('../../error-messages/orders.messages');

class OrdersService {
  async getAllOrders() {
    return await Order.find();
  }

  async getOrderById(id) {
    const foundOrder = await Order.findById(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }

  async updateOrder(id, order) {
    const orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
      throw new Error(ORDER_NOT_FOUND);
    }
    return await Order.findByIdAndUpdate(id, order, {
      new: true,
    });
  }

  async addOrder(data) {
    return new Order(data).save();
  }

  async deleteOrder(id) {
    const foundOrder = await Order.findByIdAndDelete(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }
}
module.exports = new OrdersService();
