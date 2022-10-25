const mongoose = require('mongoose');
const novaPoshtaService = require('../../../modules/delivery/nova-poshta/nova-poshta.service');
const { setupApp } = require('../../helper-functions');
const {
  getNovaPoshtaCities,
  getNovaPoshtaStreets,
  getNovaPoshtaWarehouses,
  getNovaPoshtaPrices,
} = require('./nova-poshta.helper');
const {
  novaPoshtaPriceResult,
  novaPoshtaWarehousesResult,
  novaPoshtaStreetResult,
  novaPoshtaCityResult,
  city,
  cityRef,
  novaPoshtaPrice,
  getNovaPoshtaRequestError,
} = require('./nova-poshta.variables');

let operations;

function mockError() {
  jest
    .spyOn(novaPoshtaService, 'getNovaPoshtaRequest')
    .mockImplementation(() => {
      throw new Error(getNovaPoshtaRequestError);
    });
}

describe('Nova poshta queries tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  beforeEach(() => {
    jest
      .spyOn(novaPoshtaService, 'getNovaPoshtaRequest')
      .mockImplementation(() => ({
        data: {
          data: [
            {
              ...novaPoshtaPriceResult,
              ...novaPoshtaCityResult,
              ...novaPoshtaStreetResult,
              ...novaPoshtaWarehousesResult,
            },
          ],
        },
      }));
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should get Nova Poshta cities', async () => {
    const [result] = await getNovaPoshtaCities(city, operations);

    expect(result.cityID).toBe(novaPoshtaCityResult.CityID);
  });

  it('should throw error while get Nova Poshta cities', async () => {
    mockError();

    const result = await getNovaPoshtaCities(city, operations);

    expect(result.message).toBe(getNovaPoshtaRequestError);
  });

  it('should get Nova Poshta streets', async () => {
    const [result] = await getNovaPoshtaStreets(cityRef, city, operations);

    expect(result.description).toBe(novaPoshtaStreetResult.Description);
  });

  it('should throw error while get Nova Poshta streets', async () => {
    mockError();

    const result = await getNovaPoshtaStreets(cityRef, city, operations);

    expect(result.message).toBe(getNovaPoshtaRequestError);
  });

  it('should get Nova Poshta warehouses', async () => {
    const [result] = await getNovaPoshtaWarehouses(city, operations);

    expect(result.number).toBe(novaPoshtaWarehousesResult.Number);
  });

  it('should throw error while get Nova Poshta warehouses', async () => {
    mockError();

    const result = await getNovaPoshtaWarehouses(city, operations);

    expect(result.message).toBe(getNovaPoshtaRequestError);
  });

  it('should get Nova Poshta prices', async () => {
    const [result] = await getNovaPoshtaPrices(novaPoshtaPrice, operations);

    expect(result.cost).toBe(novaPoshtaPriceResult.Cost);
  });

  it('should throw error while get Nova Poshta prices', async () => {
    mockError();

    const result = await getNovaPoshtaPrices(novaPoshtaPrice, operations);

    expect(result.message).toBe(getNovaPoshtaRequestError);
  });
});
