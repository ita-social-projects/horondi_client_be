const { wrongId, ERROR_NOT_FOUND, firstHeader } = require('./header.variables');
const { setupApp } = require('../helper-functions');
const {
  addHeader,
  getAllHeaders,
  deleteHeader,
  getHeaderById,
} = require('./header.helper');

describe('Header queries tests', () => {
  let operations;
  let headerId;
  beforeAll(async () => {
    operations = await setupApp();
    const headerData = await addHeader(firstHeader, operations);
    headerId = headerData._id;
  });

  test('Should receive all headers', async () => {
    const result = await getAllHeaders(operations);
    expect(result).toContainEqual({
      _id: headerId,
      ...firstHeader,
    });
  });

  test('Should receive header by id', async () => {
    const result = await getHeaderById(headerId, operations);
    expect(result).toEqual({
      _id: headerId,
      ...firstHeader,
    });
  });

  test('Should receive HEADER_NOT_FOUND message when try to get header by wrong id', async () => {
    const result = await getHeaderById(wrongId, operations);
    expect(result).toEqual(ERROR_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteHeader(headerId, operations);
  });
});
