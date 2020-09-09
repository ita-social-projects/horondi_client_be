const deliveryService = require('./delivery.service')
const { 
    CITY_NOT_FOUND, 
    WAREHOUSE_NOT_FOUND 
}= require('../../error-messages/delivery.message')

const novaPoshtaQuery = {
    getNovaPoshtaCities: async (parent, args) => {
        const cities = await deliveryService.getNovaPoshtaCities(args.city);
        if(cities.length) {
            return cities
        }
        return [{
            statusCode: 404,
            message: CITY_NOT_FOUND,
        }]
    },

    getNovaPoshtaWarehouses: async (parent, args) => {
        const cities = await deliveryService.getNovaPoshtaWarehouses(args.city);
        if(cities.length) {
            return cities
        }
        return [{
            statusCode: 404,
            message: WAREHOUSE_NOT_FOUND,
        }]
    },

    getNovaPoshtaPrice: async (parent, args) => {
        const price = await deliveryService.getNovaPoshtaPrice(args.data);
        if(price.length) {
            return price
        }
        return [{
            statusCode: 404,
            message: WAREHOUSE_NOT_FOUND,
        }]
    },

    createNovaPoshtaOrder: async (parent, args) => await deliveryService.createNovaPoshtaOrder(args.data)
}

const ukrPoshtaQuery = {
    getUkrPoshtaRegion: async (parent, args) =>  await deliveryService.getUkrPoshtaRegion(args.region)
}

module.exports = { novaPoshtaQuery, ukrPoshtaQuery }