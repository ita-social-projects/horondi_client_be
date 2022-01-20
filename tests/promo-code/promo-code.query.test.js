const { setupApp } = require('../helper-functions');
const { getAllPromoCodes } = require('./promo-code.helper');

describe('Promo-codes queries', () => {
  it('Should get all promo-codes', async () => {
    const operations = await setupApp();
    const answers = await getAllPromoCodes(operations);
    expect(answers).toBeDefined();
    expect(answers.items).toBeInstanceOf(Array);
  });
});
