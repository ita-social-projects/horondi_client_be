const {
  newPromoCode,
  newPromoCodeForUpdate,
} = require('./promo-code.variables');
const { setupApp } = require('../helper-functions');
const {
  addPromoCode,
  deletePromoCode,
  updatePromoCode,
} = require('./promo-code.helper');

let promoCodes;
let promoCodeId;
let operations;

describe('PromoCodes mutations', () => {
  beforeEach(async () => {
    operations = await setupApp();
    promoCodes = await addPromoCode(newPromoCode, operations);
    promoCodeId = promoCodes._id;
  });

  it('should add to database', async () => {
    promoCodes = await addPromoCode(newPromoCode, operations);

    expect(promoCodes).toHaveProperty('code', newPromoCode.code);
    expect(promoCodes.dateFrom).toEqual(newPromoCode.dateFrom);
    expect(promoCodes).toHaveProperty('discount', newPromoCode.discount);
    expect(promoCodes.discount).toEqual(newPromoCode.discount);
  });

  it('update promo-code', async () => {
    const receivedUpdatedPromoCode = await updatePromoCode(
      promoCodeId,
      newPromoCodeForUpdate,
      operations
    );
    const updatedPromoCode = receivedUpdatedPromoCode.data.updatePromoCode;

    expect(updatedPromoCode).toHaveProperty(
      'dateTo',
      newPromoCodeForUpdate.dateTo
    );
  });

  it('delete promo-code', async () => {
    const res = await deletePromoCode(promoCodeId, operations);
    promoCodes = res.data.deletePromoCode;

    expect(promoCodes).toHaveProperty('code', newPromoCode.code);
    expect(promoCodes.dateFrom).toEqual(newPromoCode.dateFrom);
    expect(promoCodes).toHaveProperty('discount', newPromoCode.discount);
  });
});
