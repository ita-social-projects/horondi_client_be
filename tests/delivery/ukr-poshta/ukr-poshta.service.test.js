const ukrPoshtaService = require('../../../modules/delivery/ukr-poshta/ukr-poshta.service');
const {
  getUkrPoshtaRequestData,
  data,
  id,
  address,
  client,
  order,
} = require('./ukr-poshta.variables');

jest.spyOn(ukrPoshtaService, 'getUkrPoshtaRequest').mockImplementation(() => ({
  data: getUkrPoshtaRequestData,
}));

describe('ukrPoshtaService tests', () => {
  it('should return createUkrPoshtaAddress expected result', async () => {
    const result = await ukrPoshtaService.createUkrPoshtaAddress(address);

    expect(result).toBe(getUkrPoshtaRequestData);
  });

  it('should return getUkrPoshtaAddressById expected result', async () => {
    const result = await ukrPoshtaService.getUkrPoshtaAddressById(id);

    expect(result).toBe(getUkrPoshtaRequestData);
  });

  it('should return createUkrPoshtaClient expected result', async () => {
    const result = await ukrPoshtaService.createUkrPoshtaClient(data);

    expect(result).toBe(getUkrPoshtaRequestData);
  });

  it('should return createUkrPoshtaOrder expected result', async () => {
    const result = await ukrPoshtaService.createUkrPoshtaOrder(client, order);

    expect(result).toBe(getUkrPoshtaRequestData);
  });
});
