const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { getMaterial } = require('../materials/material.variables');
const { color, wrongId } = require('../color/color.variables');
const { setupApp } = require('../helper-functions');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST,
} = require('../../error-messages/constructor-bottom.messages');
const {
  createConstructorBottom,
  updateConstructorBottom,
  deleteConstructorBottom,
} = require('./constructor-bottom.helper');

const {
  newConstructorBottom,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor-bottom.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let constructorId;
let currentConstructorBottom;
let newDataConstructorBottom;
let result;

jest.mock('../../modules/currency/currency.utils.js');

describe('Constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    addConstructor = newConstructorBottom(colorId, materialId);
    currentConstructorBottom = getConstructorData(addConstructor);
    newDataConstructorBottom = getConstructorDataForUpt(colorId, materialId);
  });

  test('should create constructor-bottom', async () => {
    const createConstructorBottom = await createConstructorBottom(
      addConstructor,
      operations
    );
    constructorId = createConstructorBottom._id;

    expect(createConstructorBottom).toBeDefined();
    expect(createConstructorBottom).toEqual({
      ...currentConstructorBottom,
      _id: constructorId,
    });
  });
  //
  // test('should update existing constructor-bottom', async () => {
  //   await updateConstructorB(
  //     constructorId,
  //     operations,
  //     newDataConstructorBottom,
  //   );
  //   expect(updateConstructorB).toBeDefined();
  //   expect(updateConstructorB.image).not.toEqual(result.image);
  //   expect(updateConstructorB.name).not.toEqual(result.name);
  // });
  // test('should return Error (already exist) when creating same constructor-bottom again', async () => {
  //   const createConstructorAgain = await createConstructorBottom(
  //     newDataConstructorBottom,
  //     operations,
  //   );
  //   expect(createConstructorAgain.message).toBeDefined();
  //   expect(createConstructorAgain.message).toEqual(
  //     CONSTRUCTOR_BOTTOM_ALREADY_EXIST,
  //   );
  // });
  // test('should return Error (not found) when updating not existing constructor-bottom', async () => {
  //   const updateConstructor = await updateConstructorB(
  //     WRONG_ID,
  //     operations,
  //     addConstructor,
  //   );
  //   expect(updateConstructor).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  // });
  // test('should return Error (not found) when try to delete wrong constructor-bottom', async () => {
  //   const deletedConstructor = await updateConstructorB(
  //     WRONG_ID,
  //     operations,
  //     addConstructor,
  //   );
  //   expect(deletedConstructor).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  // });

  test('should delete constructor-bottom and return id', async () => {
    const deletedConstructor = await deleteConstructorBottom(
      constructorId,
      operations
    );

    expect(deletedConstructor).toBe(constructorId);
  });

  afterAll(async () => {
    await deleteColor(colorId);
    await deleteMaterial(materialId);
  });
});
