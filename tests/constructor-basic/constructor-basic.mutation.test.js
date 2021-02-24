const { setupApp } = require('../helper-functions');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  getConstructorBasicById,
  deleteConstructorBasic,
  updateConstructorBasic,
  createConstructorBasic,
} = require('./constructor-basic.helper');
const {
  BASIC_ALREADY_EXIST,
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');
const { getMaterial } = require('../materials/material.variables');
const { color } = require('../color/color.variables');
const {
  wrongId,
  newConstructorBasic,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor-basic.variables');

let operations;
let colorId;
let materialInput;
let receivedMaterial;
let materialID;
let constructorInput;
let constructorBasicID;
let currentConstructorBasic = {};
let constructorUpdateInput;
let currentconstructorUpdate;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    receivedMaterial = await createMaterial(materialInput, operations);
    materialID = receivedMaterial._id;
    constructorInput = newConstructorBasic(materialID, colorId);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentconstructorUpdate = getConstructorData(constructorUpdateInput);
    currentConstructorBasic = getConstructorData(constructorInput);
  });

  test('#1 Should add Constructor Basic', async done => {
    const createConstructor = await createConstructorBasic(
      constructorInput,
      operations
    );
    constructorBasicID = createConstructor._id;

    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });
    done();
  });
  test('#3 ConstructorBasic should return Error ConstructorBasic already exist', async done => {
    const createConstructor = await createConstructorBasic(
      constructorInput,
      operations
    );

    expect(createConstructor).toBeDefined();
    expect(createConstructor.message).toEqual(BASIC_ALREADY_EXIST);
    expect(createConstructor.statusCode).toEqual(400);
    done();
  });
  test('#2 Should update existing constructorBasic ', async done => {
    const updateConstructor = await updateConstructorBasic(
      constructorUpdateInput,
      constructorBasicID,
      operations
    );

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: constructorBasicID,
    });
    done();
  });
  test('#4 UpdateConstructorBasic should return BASIC_NOT_FOUND', async done => {
    const updateConstructor = await updateConstructorBasic(
      constructorInput,
      wrongId,
      operations
    );
    const result = updateConstructor.message;

    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#5 deleteConstructorBasic should return error BASIC_NOT_FOUND', async done => {
    const deletedConstructor = await deleteConstructorBasic(
      wrongId,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorBasic.message;

    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#6 Should delete constructor basic and return id', async done => {
    const deletedConstructor = await deleteConstructorBasic(
      constructorBasicID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorBasic._id;

    expect(result).toBe(constructorBasicID);
    done();
  });

  afterAll(async done => {
    await deleteMaterial(materialID, operations);
    await deleteColor(colorId, operations);
    done();
  });
});
