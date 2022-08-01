const { setupApp } = require('../helper-functions');
const {
  addCurrency,
  updateCurrency,
  deleteCurrency,
  getCurrencyById,
} = require('./currency.helper');
const {
  newCurrency,
  updatedCurrency,
  invalidCurrencyID,
  savedCurrency,
} = require('./currency.variables');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  CURRENCY_ALREADY_EXIST,
  CURRENCY_NOT_FOUND,
} = require('../../error-messages/currency.messages');

let operations;
let currency;
let existingCurrency;

describe('Currency mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();

    existingCurrency = await addCurrency(savedCurrency, operations);
  });

  it('should add a currency', async () => {
    currency = await addCurrency(newCurrency, operations);

    expect(currency.convertOptions).toEqual(newCurrency.convertOptions);
  });

  it('should receive an error when adding a currency with an existing name', async () => {
    const error = await addCurrency(newCurrency, operations);

    expect(error.statusCode).toBe(BAD_REQUEST);
    expect(error.message).toBe(CURRENCY_ALREADY_EXIST);
  });

  it('should update a currency', async () => {
    currency = await updateCurrency(currency._id, updatedCurrency, operations);

    expect(currency.convertOptions).toEqual(updatedCurrency.convertOptions);
  });

  it('should receive an error when updating a currency with an existing name', async () => {
    const error = await updateCurrency(currency._id, savedCurrency, operations);

    expect(error.statusCode).toBe(BAD_REQUEST);
    expect(error.message).toBe(CURRENCY_ALREADY_EXIST);
  });

  it('should receive an error when updating a non-existing currency', async () => {
    const error = await updateCurrency(
      invalidCurrencyID,
      updatedCurrency,
      operations
    );

    expect(error.statusCode).toBe(NOT_FOUND);
    expect(error.message).toBe(CURRENCY_NOT_FOUND);
  });

  it('should delete a currency', async () => {
    await deleteCurrency(currency._id, operations);
    const error = await getCurrencyById(currency._id, operations);

    expect(error.statusCode).toBe(NOT_FOUND);
    expect(error.message).toBe(CURRENCY_NOT_FOUND);
  });

  it('should receive an error when deleting an invalid currency', async () => {
    const error = await deleteCurrency(invalidCurrencyID, operations);

    expect(error.statusCode).toBe(NOT_FOUND);
    expect(error.message).toBe(CURRENCY_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteCurrency(existingCurrency._id, operations);
  });
});
