const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { BASICS_NOT_FOUND } = require('../../consts/basics-messages');
const {
  wrongId,
  newBasicsInputData,
  newBasicsInputDataUpdate,
} = require('./basics.variables');
const { createBasics, updateBasics, deleteBasics } = require('./basics.helper');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let basicsId;
let basicsInput;
let basicsUpdateInput;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');

describe('Basics Mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;

    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;

    basicsInput = newBasicsInputData(materialId, colorId);
    basicsUpdateInput = newBasicsInputDataUpdate(materialId, colorId);
  });

  it('should create basic', async () => {
    const createBasicsTest = await createBasics(
      basicsInput,
      'image.jpg',
      operations
    );
    basicsId = createBasicsTest._id;

    expect(createBasicsTest).toBeDefined();
    expect(createBasicsTest).toHaveProperty('available', basicsInput.available);
    expect(createBasicsTest).toHaveProperty('name', basicsInput.name);
  });

  it('should update basic', async () => {
    const updateBasicsTest = await updateBasics(
      basicsId,
      basicsUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(updateBasicsTest).toBeDefined();
    expect(updateBasicsTest).toHaveProperty('name', basicsUpdateInput.name);
  });
  it('should update basic without image', async () => {
    const updateBasicsTest = await updateBasics(
      basicsId,
      basicsUpdateInput,
      '',
      operations
    );

    expect(updateBasicsTest).toBeDefined();
    expect(updateBasicsTest).toHaveProperty('name', basicsUpdateInput.name);
  });

  it('should create basics without image', async () => {
    const createBasicsTest = await createBasics(basicsInput, '', operations);
    basicsId = createBasicsTest._id;

    expect(createBasicsTest).toBeDefined();
    expect(createBasicsTest).toHaveProperty('available', basicsInput.available);
    expect(createBasicsTest).toHaveProperty('name', basicsInput.name);
  });

  it('should update basic with errors', async () => {
    const result = await updateBasics(
      wrongId,
      basicsUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BASICS_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  it('delete basics should return error', async () => {
    const result = await deleteBasics(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BASICS_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  it('should delete basics without image', async () => {
    const deletedBasics = await deleteBasics(basicsId, operations);

    const result = deletedBasics._id;
    expect(result).toBe(basicsId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
