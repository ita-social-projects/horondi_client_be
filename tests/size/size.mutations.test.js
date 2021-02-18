const { setupApp } = require('../helper-functions');
const {
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_NOT_FOUND,
} = require('./size.variables');
const {
  createSize,
  getSizeById,
  updateSize,
  deleteSize,
} = require('./size.helper');

jest.mock('../../modules/currency/currency.utils.js');

let operations;
let sizeId;
let size_updated;

describe('Sizes mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    done();
  });

  test('should add size', async done => {
    const result = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = result._id;

    expect(result).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size1,
    });
    done();
  });

  test('should update size by ID and input', async done => {
    await updateSize(sizeId, SIZES_TO_CREATE.size2, operations);
    const resultGetSizeById = await getSizeById(sizeId, operations);
    size_updated = resultGetSizeById;

    expect(resultGetSizeById).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size2,
    });
    done();
  });

  test('should receive error message SIZE_NOT_FOUND while updating', async done => {
    const result = await updateSize(
      WRONG_ID,
      SIZES_TO_CREATE.size1,
      operations
    );

    expect(result).toEqual({
      ...ERROR_NOT_FOUND,
    });
    done();
  });

  test('Should delete size by ID', async done => {
    const result = await deleteSize(sizeId, operations);

    expect(result).toEqual({
      ...size_updated,
    });
    done();
  });

  test('should recieve error SIZE_NOT_FOUND while deleting', async done => {
    const result = await deleteSize(WRONG_ID, operations);

    expect(result).toEqual(ERROR_NOT_FOUND);
    done();
  });
});
