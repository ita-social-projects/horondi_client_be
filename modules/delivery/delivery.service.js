const request = require('request');
const util = require('util')
const post = util.promisify(request.post)
const { 
    CITY_NOT_FOUND,
    WAREHOUSE_NOT_FOUND,
 } = require('../../error-messages/delivery.message')

class DeliveryService {
    async getDeliveryCities(city){  
        const res = await post(
            'https://api.novaposhta.ua/v2.0/json/',
            { 
              json: true,
              body: {
                "modelName": "Address",
                "calledMethod": "getCities",
                "methodProperties": {
                    "FindByString": city
                },
                "apiKey": "9d5b19bd585bb3ac5aee7b9d6dc08d57"
              }
            },
        );

        if(res.body.errors.lenght) {
            throw new Error(CITY_NOT_FOUND)
        }
        return res.body.data.slice(0, 10);
    }

    async getDeliveryWarehouses(city){  
        const res = await post(
            'https://api.novaposhta.ua/v2.0/json/',
            { 
              json: true,
              body: {
                "modelName": "AddressGeneral",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    "CityName": city
                },
                "apiKey": "9d5b19bd585bb3ac5aee7b9d6dc08d57"
              }
            },
        );

        if(res.body.errors.lenght) {
            throw new Error(WAREHOUSE_NOT_FOUND)
        }
        return res.body.data.slice(0, 10);
    }
}

module.exports = new DeliveryService()