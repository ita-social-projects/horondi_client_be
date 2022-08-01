const { setupApp } = require('../helper-functions');
const {
  getAllCurrencies,
  getCurrencyById,
  addCurrency,
  deleteCurrency,
} = require('./currency.helper');
const { newCurrency, invalidCurrencyID } = require('./currency.variables');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

let operations;
let currency;

describe('Currency queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    currency = await addCurrency(newCurrency, operations);
  });

  it('should get all currencies', async () => {
    const currencies = await getAllCurrencies(operations);

    expect(currencies.length).toBeGreaterThan(0);
  });

  it('should get a currency by id', async () => {
    const foundCurrency = await getCurrencyById(currency._id, operations);

    expect(foundCurrency.convertOptions).toEqual(currency.convertOptions);
  });

  it('should receive an error when getting a currency by invalid id', async () => {
    const error = await getCurrencyById(invalidCurrencyID, operations);

    expect(error.statusCode).toBe(NOT_FOUND);
    expect(error.message).toBe(CURRENCY_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteCurrency(currency._id, operations);
  });
});
