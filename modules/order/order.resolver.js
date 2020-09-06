const orderService = require('./order.service');

const orderQuery = {
    getOrderById: async (parent,args) => {
        try {
            return await orderService.getOrderById(args.id);
        } 
        catch(err) {
            return {
                statusCode: 400,
                message: err.message
            }
        }
    }
}

module.exports = {
    orderQuery
}