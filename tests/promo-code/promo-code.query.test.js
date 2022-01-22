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

  it('Should get promo-code by field code', async () => {
    const operations = await setupApp();
    await addPromoCode(newPromoCode, operations);
    const promoCode = await getPromoCodeByCode(newPromoCode.code, operations);
    expect(promoCode).toHaveProperty('code', newPromoCode.code);
  });
});
