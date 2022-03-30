const ukrPoshtaService = require('../../../modules/delivery/ukr-poshta/ukr-poshta.service');
const { setupApp } = require('../../helper-functions');
const {
  getUkrPoshtaRegions,
  getUkrPoshtaPostofficesCityId,
  getUkrPoshtaDistrictsByRegionId,
  getUkrPoshtaCitiesByDistrictId,
  getUkrPoshtaStreetsByCityId,
} = require('./ukr-poshta.helper');
const {
  id,
  getUkrPoshtaPostofficesResult,
  getUkrPoshtaRegionsResult,
  getUkrPoshtaDistrictsResult,
  getUkrPoshtaCitiesResult,
  getUkrPoshtaStreetsResult,
  error,
} = require('./ukr-poshta.variables');

let operations;

function mockError() {
  jest
    .spyOn(ukrPoshtaService, 'getUkrPoshtaAddressRequest')
    .mockImplementation(() => {
      throw new Error(error);
    });
}

describe('ukr-poshta queries tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  beforeEach(() => {
    jest
      .spyOn(ukrPoshtaService, 'getUkrPoshtaAddressRequest')
      .mockImplementation(() => ({
        data: {
          Entries: {
            Entry: [
              {
                ...getUkrPoshtaRegionsResult,
                ...getUkrPoshtaCitiesResult,
                ...getUkrPoshtaPostofficesResult,
                ...getUkrPoshtaDistrictsResult,
                ...getUkrPoshtaStreetsResult,
              },
            ],
          },
        },
      }));
  });

  it('should return expected getUkrPoshtaRegions result', async () => {
    const [result] = await getUkrPoshtaRegions(operations);

    expect(result.REGION_ID).toBe(getUkrPoshtaRegionsResult.REGION_ID);
  });

  it('should throw expected getUkrPoshtaRegions error', async () => {
    mockError();

    const result = await getUkrPoshtaRegions(operations);

    expect(result.message).toBe(error);
  });

  it('should return expected getUkrPoshtaCitiesByDistrictId result', async () => {
    const [result] = await getUkrPoshtaCitiesByDistrictId(id, operations);

    expect(result.CITY_ID).toBe(getUkrPoshtaCitiesResult.CITY_ID);
  });

  it('should return throw getUkrPoshtaCitiesByDistrictId error', async () => {
    mockError();

    const result = await getUkrPoshtaCitiesByDistrictId(id, operations);

    expect(result.message).toBe(error);
  });

  it('should return expected getUkrPoshtaPostofficesCityId result', async () => {
    const [result] = await getUkrPoshtaPostofficesCityId(id, operations);

    expect(result.POSTOFFICE_ID).toBe(
      getUkrPoshtaPostofficesResult.POSTOFFICE_ID
    );
  });

  it('should throw expected getUkrPoshtaPostofficesCityId error', async () => {
    mockError();

    const result = await getUkrPoshtaPostofficesCityId(id, operations);

    expect(result.message).toBe(error);
  });

  it('should return expected getUkrPoshtaDistrictsByRegionId result', async () => {
    const [result] = await getUkrPoshtaDistrictsByRegionId(id, operations);

    expect(result.DISTRICT_ID).toBe(getUkrPoshtaDistrictsResult.DISTRICT_ID);
  });

  it('should throw expected getUkrPoshtaDistrictsByRegionId error', async () => {
    mockError();

    const result = await getUkrPoshtaDistrictsByRegionId(id, operations);

    expect(result.message).toBe(error);
  });

  it('should return expected getUkrPoshtaStreetsByCityId result', async () => {
    const [result] = await getUkrPoshtaStreetsByCityId(id, operations);

    expect(result.STREET_ID).toBe(getUkrPoshtaStreetsResult.STREET_ID);
  });

  it('should throw expected getUkrPoshtaStreetsByCityId error', async () => {
    mockError();

    const result = await getUkrPoshtaStreetsByCityId(id, operations);

    expect(result.message).toBe(error);
  });
});
