const mongoose = require('mongoose');
const {
  PROMOCODE_NOT_FOUND,
} = require('../../error-messages/promocode.messages');
const { setupApp } = require('../helper-functions');
const {
  getAllPromoCodes,
  getPromoCodeByCode,
  addPromoCode,
} = require('./promo-code.helper');
const { newPromoCode } = require('./promo-code.variables');

describe('Promo-codes queries', () => {
  it('Should get all promo-codes', async () => {
    const operations = await setupApp();
    const answers = await getAllPromoCodes(operations);

    expect(answers).toBeDefined();
    expect(answers.items).toBeInstanceOf(Array);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
  it('Should get promo-code by field code', async () => {
    const operations = await setupApp();
    await addPromoCode(newPromoCode, operations);
    const { data } = await getPromoCodeByCode(newPromoCode.code, operations);

    expect(data.getPromoCodeByCode).toHaveProperty('code', newPromoCode.code);
  });
  it('Should get promo-code by field code', async () => {
    const operations = await setupApp();
    await addPromoCode(newPromoCode, operations);
    const { data } = await getPromoCodeByCode(newPromoCode.code, operations);

    expect(data.getPromoCodeByCode).toHaveProperty('code', newPromoCode.code);
  });

  it('Should receive Error', async () => {
    const operations = await setupApp();
    const { errors } = await getPromoCodeByCode('error', operations);

    expect(errors[0]).toHaveProperty('message', PROMOCODE_NOT_FOUND);
  });
});
