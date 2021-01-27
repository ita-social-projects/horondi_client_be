const { gql } = require('@apollo/client');
const { WRONG_ID, COLOR, ERROR_NOT_FOUND } = require('./color.variables');
const { setupApp } = require('../helper-functions');
const {
  createColor,
  getAllColors,
  getColorById,
  errorColor,
  deleteColor,
} = require('./color.helper');

let operations;
let colorId;

describe('Colors queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(COLOR, operations);
  });

  test('Should recive all colors', async () => {
    const result = await getAllColors(operations);
    expect(result).toContainEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should get color by it ID', async () => {
    const result = await getColorById(colorId, operations);
    expect(result).toEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should recive error message COLOR_NOT_FOUND while getting by wrong ID', async () => {
    const result = await errorColor(WRONG_ID, operations);
    expect(result).toEqual(ERROR_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteColor(colorId, operations);
  });
});
