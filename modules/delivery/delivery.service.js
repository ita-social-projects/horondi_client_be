const request = require('request');
const util = require('util')
const post = util.promisify(request.post)
const { 
    CITY_NOT_FOUND,
    WAREHOUSE_NOT_FOUND,
 } = require('../../error-messages/delivery.message')

class NovaPoshtaService {
    async getNovaPoshtaCities(city){  
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

    async getNovaPoshtaWarehouses(city){  
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

    async getNovaPoshtaPrice(data) {
        const {
            CitySender = "db5c88f5-391c-11dd-90d9-001a92567626",
            CityRecipient,
            Weight,
            ServiceType,
            Cost,
            CargoType = "Cargo",
            SeatsAmount = 1,
        } = data

        const res = await post(
            'https://api.novaposhta.ua/v2.0/json/',
            { 
              json: true,
              body: {
                "modelName": "InternetDocument",
                "calledMethod": "getDocumentPrice",
                "methodProperties": {
                    CitySender,
                    CityRecipient,
                    Weight,
                    ServiceType,
                    Cost,
                    CargoType,
                    SeatsAmount,
                },
                "apiKey": "9d5b19bd585bb3ac5aee7b9d6dc08d57"
              }
            },
        );

        return res.body.data
    }

    async getUkrPoshtaRegion(region) {
       //TO DO
    }
}

module.exports = new NovaPoshtaService()