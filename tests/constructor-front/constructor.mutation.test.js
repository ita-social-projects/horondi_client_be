const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
} = require('../../error-messages/constructor-front-pocket-messages');

const {
  createConstructorFrontPocket,
  deleteConstructorFrontPocket,
  updateConstructorFrontPocket,
} = require('./constructor.front.helper');

const {
  wrongId,
  newConstructorFront,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

let operations;
let colorId;
let materialID;
let constructorInput;
let constructorFrontID;
let currentConstructorFront = {};
let constructorUpdateInput;
let currentconstructorUpdate;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialID = materialData._id;
    constructorInput = newConstructorFront(materialID, colorId);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentconstructorUpdate = getConstructorData(constructorUpdateInput);
    currentConstructorFront = getConstructorData(constructorInput);
  });

  test('#1 Should add Constructor Front Pocket', async () => {
    const createConstructor = await createConstructorFrontPocket(
      constructorInput,
      operations
    );
    constructorFrontID = createConstructor._id;

    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorFront,
      _id: constructorFrontID,
    });
  });
  test('#2 Constructor Front Pocket should return Error Constructor Front Pocket already exist', async () => {
    const error = await createConstructorFrontPocket(
      constructorInput,
      operations
    );

    expect(error).toBeDefined();
    expect(error.message).toEqual(FRONT_POCKET_ALREADY_EXIST);
    expect(error.statusCode).toEqual(400);
  });
  test('#3 Should update existing Constructor Front Pocket ', async () => {
    const updateConstructor = await updateConstructorFrontPocket(
      constructorUpdateInput,
      constructorFrontID,
      operations
    );

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: constructorFrontID,
    });
  });
  test('#4 Update Constructor Front Pocket should return FRONT_POCKET_NOT_FOUND', async () => {
    const result = await updateConstructorFrontPocket(
      constructorInput,
      wrongId,
      operations
    );

    expect(result.message).toBe(FRONT_POCKET_NOT_FOUND);
  });
  test('#5 delete Constructor Front Pocket should return error FRONT_POCKET_NOT_FOUND', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      wrongId,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket.message;

    expect(result).toBe(FRONT_POCKET_NOT_FOUND);
  });
  test('#6 Should delete Constructor Front Pocket and return id', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      constructorFrontID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket._id;

    expect(result).toBe(constructorFrontID);
  });

  afterAll(async () => {
    await deleteMaterial(materialID, operations);
    await deleteColor(colorId, operations);
  });
});
