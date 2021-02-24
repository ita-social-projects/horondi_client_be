const { setupApp } = require('../helper-functions');
const { SIZES_TO_CREATE, SIZES_TO_TEST } = require('./size.variables');
const {
  createSize,
  getAllSizes,
  getSizeById,
  deleteSize,
} = require('./size.helper');

jest.mock('../../modules/currency/currency.utils.js');

let operations;
let sizeId;

describe('Sizes queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const size = await createSize(SIZES_TO_CREATE.size1, operations);

    sizeId = size._id;
    done();
  });

  test('should recieve all sizes', async done => {
    const result = await getAllSizes(operations);

    expect(result[0]).toEqual(SIZES_TO_TEST.size1);
    done();
  });
  test('should recieve sizes by ID', async done => {
    const result = await getSizeById(sizeId, operations);

    expect(result).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size1,
    });
    done();
  });

  afterAll(async done => {
    await deleteSize(sizeId, operations);
    done();
  });
});
