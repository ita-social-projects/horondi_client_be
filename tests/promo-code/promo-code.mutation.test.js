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
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add to database', async () => {
    promoCodes = await addPromoCode(newPromoCode, operations);
    promoCodeId = promoCodes._id;

    expect(promoCodes).toHaveProperty('discount', newPromoCode.discount);
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

    expect(promoCodes._id).toEqual(promoCodeId);
  });
});
