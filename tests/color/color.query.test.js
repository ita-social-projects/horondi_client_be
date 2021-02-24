const { wrongId, color, ERROR_NOT_FOUND } = require('./color.variables');
const { setupApp } = require('../helper-functions');
const {
  createColor,
  getAllColors,
  getColorById,
  deleteColor,
} = require('./color.helper');

let operations;
let colorId;

describe('Colors queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);

    colorId = colorData._id;
  });

  test('Should recive all colors', async () => {
    const result = await getAllColors(operations);

    expect(result).toContainEqual({
      _id: colorId,
      ...color,
    });
  });

  test('Should get color by it ID', async () => {
    const result = await getColorById(colorId, operations);

    expect(result).toEqual({
      _id: colorId,
      ...color,
    });
  });

  test('Should recive error message COLOR_NOT_FOUND while getting by wrong ID', async () => {
    const result = await getColorById(wrongId, operations);

    expect(result).toEqual(ERROR_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteColor(colorId, operations);
  });
});
