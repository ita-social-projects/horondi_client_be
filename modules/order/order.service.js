const Order = require('./order.model');

const {ORDER_NOT_FOUND} = require('../../error-messages/order.messages');

class OrderService {
    async getOrderById(id) {
        const order = await Order.findById(id);
        if (order) {
            return order;
        }
        throw new Error(ORDER_NOT_FOUND);
    }
}

module.exports = new OrderService();