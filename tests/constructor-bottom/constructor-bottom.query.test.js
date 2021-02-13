const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');
const { createConstructorBottom } = require('./constructor-bottom.helper');
const { getMaterial } = require('../materials/material.variables');
const { color, wrongId } = require('../color/color.variables');
const { newConstructorBottom } = require('./constructor-bottom.variables');
const {
  getAllConstructorBottom,
  getConstructorBottomById,
  deleteConstructorBottom,
} = require('./constructor-bottom.helper');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

jest.mock('../../modules/currency/currency.utils.js');

describe('Constructor query', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    addConstructor = newConstructorBottom(colorId, materialId);
    newConstructorForQuery = await createConstructorBottom(
      addConstructor,
      operations
    );
    done();
  });
  test('should return all ConstructorBasics', async done => {
    const allConstructorBottom = await getAllConstructorBottom(operations);

    expect(allConstructorBottom).toBeDefined();
    expect(allConstructorBottom.length).toBeGreaterThan(0);
    done();
  });
  test('should return constructor-bottom by Id', async done => {
    const constructorBottomById = await getConstructorBottomById(
      newConstructorForQuery._id,
      operations
    );

    expect(constructorBottomById).toBeDefined();
    done();
  });
  test('should return error when try to get constructor-bottom by wrong ID', async done => {
    const constructorBottomById = await getConstructorBottomById(
      wrongId,
      operations
    );

    expect(constructorBottomById.statusCode).toBe(404);
    done();
  });

  afterAll(async done => {
    await deleteConstructorBottom(newConstructorForQuery._id, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    done();
  });
});
