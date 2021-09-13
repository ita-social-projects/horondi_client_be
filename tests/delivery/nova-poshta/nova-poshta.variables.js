const city = 'some city';
const cityRef = 'some city';
const novaPoshtaPrice = {
  citySender: city,
  cityRecipient: 'some city',
  weight: 20,
  serviceType: 'some type',
  cost: 100,
  cargoType: 'some type',
  seatsAmount: 5,
};
const novaPoshtaCityResult = {
  Description: 'some description',
  Ref: 'some ref',
  CityID: 'some ID',
};
const novaPoshtaStreetResult = {
  Description: 'some description',
  Ref: 'some ref',
  CityID: 'some ID',
};
const novaPoshtaWarehousesResult = {
  Description: 'some description',
  ShortAddress: 'some address',
  Number: 50,
  PlaceMaxWeightAllowed: 50,
  TotalMaxWeightAllowed: 100,
  Phone: 'some phone',
  Ref: 'Lviv',
  Schedule: {
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday',
    Sunday: 'sunday',
  },
};
const novaPoshtaPriceResult = {
  AssessedCost: 200,
  Cost: 100,
  CityRedelivery: 250,
  CostPack: 50,
};
const expectedCreateOrderResult = {
  ref: 'some ref',
  CostOnSite: 100,
  IntDocNumber: 10,
  TypeDocument: 'some type',
  Ref: 'some Ref',
};
const dataForOrder = {
  weight: 20,
  cost: 100,
  description: 'Lviv',
  recipientCityName: 'Lviv',
  recipientAddressName: 'Lviv',
  recipientName: 'name',
  recipientType: 'type',
  recipientsPhone: 'phone',
};
const getNovaPoshtaRequestError = 'something wrong';
module.exports = {
  city,
  cityRef,
  novaPoshtaPrice,
  novaPoshtaCityResult,
  novaPoshtaStreetResult,
  novaPoshtaWarehousesResult,
  novaPoshtaPriceResult,
  expectedCreateOrderResult,
  dataForOrder,
  getNovaPoshtaRequestError,
};
