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

jest.mock('../../modules/currency/currency.utils.js');

describe('Constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    addConstructor = newConstructorBottom(colorId, materialId);
    currentConstructorBottom = getConstructorData(addConstructor);
    newDataConstructorBottom = getConstructorDataForUpt(colorId, materialId);
    done();
  });

  test('should create constructor-bottom', async done => {
    const createConstructorBottomData = await createConstructorBottom(
      addConstructor,
      operations
    );
    constructorId = createConstructorBottomData._id;

    expect(createConstructorBottomData).toBeDefined();
    expect(createConstructorBottomData).toEqual({
      ...currentConstructorBottom,
      _id: constructorId,
    });
    done();
  });

  test('should update existing constructor-bottom', async done => {
    const updatedData = await updateConstructorBottom(
      constructorId,
      newDataConstructorBottom,
      operations
    );

    expect(updatedData).toBeDefined();
    expect(updatedData.image).not.toEqual(currentConstructorBottom.image);
    done();
  });
  test('should return Error (already exist) when creating same constructor-bottom again', async done => {
    const createConstructorAgain = await createConstructorBottom(
      newDataConstructorBottom,
      operations
    );

    expect(createConstructorAgain.message).toBeDefined();
    expect(createConstructorAgain.message).toEqual(
      CONSTRUCTOR_BOTTOM_ALREADY_EXIST
    );
    done();
  });
  test('should return Error (not found) when updating not existing constructor-bottom', async done => {
    const updateConstructor = await updateConstructorBottom(
      wrongId,
      addConstructor,
      operations
    );

    expect(updateConstructor.message).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    done();
  });

  test('should delete constructor-bottom and return id', async done => {
    const deletedConstructor = await deleteConstructorBottom(
      constructorId,
      operations
    );

    expect(deletedConstructor._id).toBe(constructorId);
    done();
  });

  afterAll(async done => {
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    done();
  });
});
