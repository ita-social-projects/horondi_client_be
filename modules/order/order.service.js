const Order = require('./order.model');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const ObjectId = require('mongoose').Types.ObjectId;

class OrdersService {
  async getAllOrders() {
    return await Order.find();
  }

  async getOrderById(id) {
    if(!ObjectId.isValid(id)){
      throw new Error(ORDER_NOT_VALID)
    }
    const foundOrder = await Order.findById(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }

  async updateOrder(id, order) {
    if(!ObjectId.isValid(id)){
      throw new Error(ORDER_NOT_VALID)
    }
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
    if(!ObjectId.isValid(id)){
      throw new Error(ORDER_NOT_VALID)
    }
    const foundOrder = await Order.findByIdAndDelete(id);
    if (foundOrder) {
      return foundOrder;
    }
    throw new Error(ORDER_NOT_FOUND);
  }
}
module.exports = new OrdersService();
