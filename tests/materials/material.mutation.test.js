const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  materialDoesNotExistId,
  getMaterial,
  getMaterialToUpdate,
} = require('./material.variables');
const {
  updateMaterial,
  deleteMaterial,
  createMaterial,
} = require('./material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let operations;
let materialId;
let colorId;
let material;
let materialToUpdate;

describe('material mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    material = getMaterial(colorId);
    materialToUpdate = getMaterialToUpdate(colorId);
  });

  it('should add material to database', async () => {
    const addedMaterial = await createMaterial(material, operations);
    materialId = addedMaterial._id;

    expect(addedMaterial).toBeDefined();
    expect(addedMaterial).toHaveProperty('name', material.name);
    expect(addedMaterial.name).toBeInstanceOf(Array);
    expect(addedMaterial).toHaveProperty('description', material.description);
    expect(addedMaterial.description).toBeInstanceOf(Array);
    expect(addedMaterial).toHaveProperty('purpose', material.purpose);
    expect(addedMaterial).toHaveProperty('available', material.available);
    expect(addedMaterial).toHaveProperty('colors', [
      {
        _id: colorId,
      },
    ]);
    expect(addedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error when adding material with the existing name', async () => {
    const newMaterial = await createMaterial(material, operations);

    expect(newMaterial).toHaveProperty('message', MATERIAL_ALREADY_EXIST);
    expect(newMaterial).toHaveProperty('statusCode', 400);
  });

  it('should update material', async () => {
    const updatedMaterial = await updateMaterial(
      materialId,
      materialToUpdate,
      operations
    );

    expect(updatedMaterial).toBeDefined();
    expect(updatedMaterial).toHaveProperty('name', materialToUpdate.name);
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty(
      'description',
      materialToUpdate.description
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty('purpose', materialToUpdate.purpose);
    expect(updatedMaterial).toHaveProperty(
      'available',
      materialToUpdate.available
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty('colors', [
      {
        _id: colorId,
      },
    ]);
    expect(updatedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error when update not existing material', async () => {
    const updatedMaterial = await updateMaterial(
      materialDoesNotExistId,
      materialToUpdate,
      operations
    );

    expect(updatedMaterial).toHaveProperty('statusCode', 404);
    expect(updatedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });

  it('should return error when update material with already existing name will', async () => {
    const { _id: testMaterialId } = await createMaterial(material, operations);
    const secondRes = await updateMaterial(
      testMaterialId,
      materialToUpdate,
      operations
    );

    expect(secondRes).toHaveProperty('statusCode', 400);
    expect(secondRes).toHaveProperty('message', MATERIAL_ALREADY_EXIST);

    await deleteMaterial(testMaterialId, operations);
  });

  it('should delete material', async () => {
    const deletedMaterial = await deleteMaterial(materialId, operations);
    const res = deletedMaterial.data.deleteMaterial;

    expect(res).toHaveProperty('_id', materialId);
  });

  it('should return error when delete not existing material', async () => {
    const deletedMaterial = await deleteMaterial(
      materialDoesNotExistId,
      operations
    );
    const res = deletedMaterial.data.deleteMaterial;

    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteColor(colorId, operations);
    await deleteMaterial(materialId, operations);

    return { deleteColor };
  });
});
