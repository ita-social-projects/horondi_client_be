const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const { testCreateMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const {
  createConstructorBasicWithData,
  getConstructorBasicById,
  deleteConstructorBasic,
  updateConstructorBasic,
} = require('./constructor-basic.helper');
const {
  BASIC_ALREADY_EXIST,
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');
const { getMaterial } = require('../materials/material.variables');
const {
  newColor,
  badConstructorBasicID,
  deleteAll,
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
let construrtorIDafter;
let constructorUpdateInput;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor, operations);
    materialInput = getMaterial(colorId);
    receivedMaterial = await testCreateMaterial(materialInput, operations);
    materialID = receivedMaterial._id;
    constructorInput = newConstructorBasic(materialID, colorId);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentconstructorUpdate = getConstructorData(constructorUpdateInput);
    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });
  afterEach(async () => {
    await deleteConstructorBasic(constructorBasicID, operations);
  });

  test('#1 Should add Constructor Basic', async done => {
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    constructorBasicID = createConstructor._id;
    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });

    const getConstructorBasic = await getConstructorBasicById(
      constructorBasicID,
      operations
    );
    const receivedConstructorBasic =
      getConstructorBasic.data.getConstructorBasicById;
    expect(receivedConstructorBasic).toBeDefined();
    expect(createConstructor).toEqual(receivedConstructorBasic);
    done();
  });

  test('#2 Should update existing constructorBasic ', async done => {
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    const updateConstructor = await updateConstructorBasic(
      constructorUpdateInput,
      createConstructor._id,
      operations
    );
    constructorBasicID = updateConstructor._id;

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: updateConstructor._id,
    });
    done();
  });

  test('#3 ConstructorBasic should return Error ConstructorBasic already exist', async done => {
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    constructorBasicID = createConstructor._id;
    const createConstructorAgain = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    const error = createConstructorAgain;

    expect(error).toBeDefined();
    expect(error.message).toEqual(BASIC_ALREADY_EXIST);
    expect(error.statusCode).toEqual(400);
    done();
  });

  test('#4 UpdateConstructorBasic should return BASIC_NOT_FOUND', async done => {
    const updateConstructor = await updateConstructorBasic(
      constructorInput,
      badConstructorBasicID,
      operations
    );
    const result = updateConstructor.message;

    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#5 deleteConstructorBasic should return error BASIC_NOT_FOUND', async done => {
    const deletedConstructor = await deleteConstructorBasic(
      badConstructorBasicID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorBasic.message;

    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#6 Should delete constructor basic and return id', async done => {
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    constructorBasicID = createConstructor._id;
    const deletedConstructor = await deleteConstructorBasic(
      constructorBasicID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorBasic._id;

    expect(result).toBe(constructorBasicID);
    done();
  });

  afterAll(async () => {
    await deleteAll(colorId, materialID, construrtorIDafter);
  });
});
