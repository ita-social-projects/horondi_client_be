const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
} = require('../../error-messages/constructor-front-pocket-messages');

const {
  createConstructorFrontPocketWithData,
  getConstructorFrontPocketById,
  deleteConstructorFrontPocket,
  updateConstructorFrontPocket,
} = require('./constructor.front.helper');

const {
  newColor,
  badConstructorFrontID,
  newMaterial,
  deleteAll,
  newConstructorFront,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor.variables');
const { createColor } = require('../color/color.helper');
const { createMaterial } = require('../materials/material.helper');

let operations;
let colorId;
let materialInput;
let materialID;
let constructorInput;
let constructorFrontID;
let currentConstructorFront = {};
let construrtorIDafter;
let constructorUpdateInput;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor, operations);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput, operations);
    constructorInput = newConstructorFront(materialID, colorId);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentconstructorUpdate = getConstructorData(constructorUpdateInput);
    currentConstructorFront = getConstructorData(constructorInput);
    done();
  });
  afterEach(async () => {
    await deleteConstructorFrontPocket(constructorFrontID, operations);
  });

  test('#1 Should add Constructor Front Pocket', async done => {
    const createConstructor = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    constructorFrontID = createConstructor._id;
    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorFront,
      _id: constructorFrontID,
    });

    done();
  });

  test('#2 Should update existing Constructor Front Pocket ', async done => {
    const createConstructor = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    const updateConstructor = await updateConstructorFrontPocket(
      constructorUpdateInput,
      createConstructor._id,
      operations
    );
    constructorFrontID = updateConstructor._id;

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: updateConstructor._id,
    });
    done();
  });

  test('#3 Constructor Front Pocket should return Error Constructor Front Pocket already exist', async done => {
    const createConstructor = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    constructorFrontID = createConstructor._id;
    const createConstructorAgain = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    const error = createConstructorAgain;

    expect(error).toBeDefined();
    expect(error.message).toEqual(FRONT_POCKET_ALREADY_EXIST);
    expect(error.statusCode).toEqual(400);
    done();
  });

  test('#4 Update Constructor Front Pocket should return FRONT_POCKET_NOT_FOUND', async done => {
    const updateConstructor = await updateConstructorFrontPocket(
      constructorInput,
      badConstructorFrontID,
      operations
    );
    const result = updateConstructor.message;

    expect(result).toBe(FRONT_POCKET_NOT_FOUND);
    done();
  });
  test('#5 delete Constructor Front Pocket should return error FRONT_POCKET_NOT_FOUND', async done => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      badConstructorFrontID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket.message;

    expect(result).toBe(FRONT_POCKET_NOT_FOUND);
    done();
  });
  test('#6 Should delete Constructor Front Pocket and return id', async done => {
    const createConstructor = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    constructorFrontID = createConstructor._id;
    const deletedConstructor = await deleteConstructorFrontPocket(
      constructorFrontID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket._id;

    expect(result).toBe(constructorFrontID);
    done();
  });

  afterAll(async () => {
    await deleteAll(colorId, materialID, construrtorIDafter);
  });
});
