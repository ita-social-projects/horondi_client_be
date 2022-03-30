const novaPoshtaService = require('../../../modules/delivery/nova-poshta/nova-poshta.service');
const {
  expectedCreateOrderResult,
  dataForOrder,
} = require('./nova-poshta.variables');

jest
  .spyOn(novaPoshtaService, 'getNovaPoshtaRequest')
  .mockImplementation(() => ({
    data: {
      data: [expectedCreateOrderResult],
    },
  }));

describe('nova-poshta.service tests', () => {
  it('should return expected result', async () => {
    const result = await novaPoshtaService.createNovaPoshtaOrder(dataForOrder);

    expect(result.values).toEqual(expectedCreateOrderResult.values);
  });
});
