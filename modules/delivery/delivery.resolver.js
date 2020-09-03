const deliveryService = require('./delivery.service')
const { 
    CITY_NOT_FOUND, 
    WAREHOUSE_NOT_FOUND 
}= require('../../error-messages/delivery.message')

const deliveryQuery = {
    getDeliveryCities: async (parent, args) => {
        const cities = await deliveryService.getDeliveryCities(args.city);
        if(cities.length) {
            return cities
        }
        return [{
            statusCode: 404,
            message: CITY_NOT_FOUND,
        }]
    },

    getDeliveryWarehouses: async (parent, args) => {
        const cities = await deliveryService.getDeliveryWarehouses(args.city);
        if(cities.length) {
            return cities
        }
        return [{
            statusCode: 404,
            message: WAREHOUSE_NOT_FOUND,
        }]
    },

    getDeliveryPrice: async (parent, args) => {
        const price = await deliveryService.getDeliveryPrice(args.data);
        if(price.length) {
            return price
        }
        return [{
            statusCode: 404,
            message: WAREHOUSE_NOT_FOUND,
        }]
    }
}

module.exports = { deliveryQuery }