const axios = require('axios');

const {
  ORDER_CREATION_FAILED,
} = require('../../../error-messages/delivery.message');
const { horondiAddress, horondyCityRef } = require('../../../consts');
const {
  NOVA_POSHTA_API_LINK,
  NOVA_POSHTA_API_KEY,
} = require('../../../dotenvValidator');
const {
  SERVICES: { ADDRESS, ADDRESS_GENERAL, INITIAL_VALUE, INITIAL_PAGES },
  DELIVERY_SERVICES_METHODS: {
    GET_CITIES,
    GET_STREET,
    GET_WAREHOUSES,
    GET_COUNTER_PARTY_CONTACT_PERSONS,
    GET_DOCUMENT_PRICE,
    SAVE,
    GET_COUNTER_PARTIES,
  },
  DELIVERY_SERVICE_TYPES: { WAREHOUSE_DOORS, WAREHOUSE_WAREHOUSE },
  CARGO_TYPES: { CARGO, PARCEL },
  DELIVERY_SERVICE_MODELS: { INTERNET_DOCUMENT, COUNTER_PARTY },
  COUNTER_PARTY_PROPERTIES: { SENDER },
} = require('../../../consts/delivery-services');
const {
  PAYMENT_METHOD: { CASH },
} = require('../../../consts/payments');

class NovaPoshtaService {
  async getNovaPoshtaRequest(properties, model, method) {
    return await axios.post(NOVA_POSHTA_API_LINK, {
      modelName: model,
      calledMethod: method,
      methodProperties: properties,
      apiKey: NOVA_POSHTA_API_KEY,
    });
  }

  async getNovaPoshtaCities(cityName) {
    const res = await this.getNovaPoshtaRequest(
      {
        FindByString: cityName,
      },
      ADDRESS,
      GET_CITIES
    );

    return res.data.data.slice(0, 10).map(city => {
      return {
        description: city.Description,
        ref: city.Ref,
        cityID: city.CityID,
      };
    });
  }

  async getNovaPoshtaStreets(cityRef, streetName) {
    const res = await this.getNovaPoshtaRequest(
      {
        CityRef: cityRef,
        FindByString: streetName,
      },
      ADDRESS,
      GET_STREET
    );

    return res.data.data.slice(0, 10).map(street => {
      return {
        description: street.Description,
        ref: street.Ref,
        streetsTypeRef: street.StreetsTypeRef,
        streetsType: street.StreetsType,
      };
    });
  }

  async getNovaPoshtaWarehouses(city) {
    const res = await this.getNovaPoshtaRequest(
      {
        CityName: city,
      },
      ADDRESS_GENERAL,
      GET_WAREHOUSES
    );

    return res.data.data.map(warehouse => {
      return {
        description: warehouse.Description,
        shortAddress: warehouse.ShortAddress,
        number: warehouse.Number,
        placeMaxWeightAllowed: warehouse.PlaceMaxWeightAllowed,
        totalMaxWeightAllowed: warehouse.TotalMaxWeightAllowed,
        phone: warehouse.Phone,
        ref: warehouse.Ref,
        schedule: {
          monday: warehouse.Schedule.Monday,
          tuesday: warehouse.Schedule.Tuesday,
          wednesday: warehouse.Schedule.Wednesday,
          thursday: warehouse.Schedule.Thursday,
          friday: warehouse.Schedule.Friday,
          saturday: warehouse.Schedule.Saturday,
          sunday: warehouse.Schedule.Sunday,
        },
      };
    });
  }

  async getNovaPoshtaPrices(data) {
    const {
      citySender = horondyCityRef,
      cityRecipient,
      weight,
      serviceType = WAREHOUSE_DOORS,
      cost,
      cargoType = CARGO,
      seatsAmount = 1,
    } = data;

    const res = await this.getNovaPoshtaRequest(
      {
        CitySender: citySender,
        CityRecipient: cityRecipient,
        Weight: weight,
        ServiceType: serviceType,
        Cost: cost,
        CargoType: cargoType,
        SeatsAmount: seatsAmount,
      },
      INTERNET_DOCUMENT,
      GET_DOCUMENT_PRICE
    );

    return res.data.data.map(price => {
      return {
        assessedCost: price.AssessedCost,
        cost: price.Cost,
        costRedelivery: price.CostRedelivery,
        costPack: price.CostPack,
      };
    });
  }

  async createNovaPoshtaOrder(data) {
    const {
      citySender = horondyCityRef,
      weight,
      payerType = SENDER,
      paymentMethod = CASH,
      serviceType = WAREHOUSE_WAREHOUSE,
      cost,
      cargoType = PARCEL,
      seatsAmount = 1,
      description,
      recipientCityName,
      recipientAddressName,
      recipientName,
      recipientType,
      recipientsPhone,
      recipientArea = INITIAL_VALUE,
      recipientAreaRegions = INITIAL_VALUE,
      recipientHouse = INITIAL_VALUE,
      recipientFlat = INITIAL_VALUE,
    } = data;

    const sender = await this.getSenderCounterparty();

    const address = await this.getSenderAddress(citySender);

    const contactSender = await this.getSenderContact(sender.Ref);

    const res = await this.getNovaPoshtaRequest(
      {
        NewAddress: '1',
        CitySender: citySender,
        Weight: weight,
        ServiceType: serviceType,
        Cost: cost,
        CargoType: cargoType,
        SeatsAmount: seatsAmount,
        Description: description,
        RecipientCityName: recipientCityName,
        RecipientAddressName: recipientAddressName,
        RecipientName: recipientName,
        RecipientType: recipientType,
        RecipientsPhone: recipientsPhone,
        PayerType: payerType,
        PaymentMethod: paymentMethod,
        RecipientArea: recipientArea,
        RecipientAreaRegions: recipientAreaRegions,
        RecipientHouse: recipientHouse,
        RecipientFlat: recipientFlat,
        Sender: sender.Ref,
        SenderAddress: address.Ref,
        ContactSender: contactSender.Ref,
        SendersPhone: contactSender.Phones,
      },
      INTERNET_DOCUMENT,
      SAVE
    );

    const document = res.data.data[0];

    if (!document) {
      throw Error(ORDER_CREATION_FAILED);
    }

    return {
      ref: document.Ref,
      costOnSite: document.CostOnSite,
      intDocNumber: document.IntDocNumber,
      typeDocument: document.TypeDocument,
    };
  }

  async getSenderCounterparty() {
    const res = await this.getNovaPoshtaRequest(
      {
        CounterpartyProperty: SENDER,
        Page: INITIAL_PAGES,
      },
      COUNTER_PARTY,
      GET_COUNTER_PARTIES
    );

    return res.data.data[0];
  }

  async getSenderAddress(cityRef) {
    const sender = await this.getSenderCounterparty();

    const street = await this.getNovaPoshtaStreets(
      cityRef,
      horondiAddress.street
    );

    const res = await this.getNovaPoshtaRequest(
      {
        CounterpartyRef: sender.Ref,
        StreetRef: street[0].ref,
        BuildingNumber: horondiAddress.buidingNumber,
        Flat: horondiAddress.flat,
      },
      ADDRESS,
      SAVE
    );

    return res.data.data[0];
  }

  async getSenderContact(sender) {
    const res = await this.getNovaPoshtaRequest(
      {
        Ref: sender,
        Page: INITIAL_PAGES,
      },
      COUNTER_PARTY,
      GET_COUNTER_PARTY_CONTACT_PERSONS
    );

    return res.data.data[0];
  }
}

module.exports = new NovaPoshtaService();
