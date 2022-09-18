const { setupApp } = require('../helper-functions');
const {
  wrongId,
  color,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
} = require('./color.variables');
const { createColor, deleteColor } = require('./color.helper');

let operations;
let colorId;

describe('Color mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should add color', async () => {
    const result = await createColor(color, operations);
    colorId = result._id;

    expect(result).toEqual({
      _id: colorId,
      ...color,
    });
  });
  test('Should receive error message COLOR_ALREADY_EXIST when color already in the db while creating', async () => {
    const result = await createColor(color, operations);

    expect(result).toEqual(ERROR_ALREDY_EXISTS);
  });
  test('Should delete color by ID', async () => {
    const result = await deleteColor(colorId, operations);

    expect(result.data.deleteColor).toEqual({
      _id: colorId,
      ...color,
    });
  });
  test('Should recieve error message COLOR_NOT_FOUND on deleting color with wrong ID', async () => {
    const result = await deleteColor(wrongId, operations);

    expect(result.data.deleteColor).toEqual(ERROR_NOT_FOUND);
  });
});
