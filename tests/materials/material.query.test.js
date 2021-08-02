const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  materialDoesNotExistId,
  graphqlErrorMessage,
  limit,
  skip,
  wrongSkip,
  wrongLimit,
  limitZero,
  getMaterial,
} = require('./material.variables');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
  getAllMaterialsWithSkipAndLimit,
} = require('./material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let materialId;
let operations;
let colorId;
let material;

describe('material quarries test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    material = getMaterial(colorId);
    const materialData = await createMaterial(material, operations);
    materialId = materialData._id;
  });

  it('should receive all materials', async () => {
    const allMaterials = await getAllMaterials(operations);

    expect(allMaterials).toBeDefined();
    expect(allMaterials.items).toBeInstanceOf(Array);
    expect(allMaterials.items).toContainEqual({
      name: [
        { lang: material.name[0].lang, value: material.name[0].value },
        { lang: material.name[1].lang, value: material.name[1].value },
      ],
      description: [
        {
          lang: material.description[0].lang,
          value: material.description[0].value,
        },
        {
          lang: material.description[1].lang,
          value: material.description[1].value,
        },
      ],
      purpose: material.purpose,
      available: material.available,
      colors: [
        {
          _id: colorId,
          ...color,
        },
      ],
    });
  });
  it('should receive one material', async () => {
    const {
      data: { getMaterialById: receivedMaterial },
    } = await getMaterialById(materialId, operations);

    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toHaveProperty('name', material.name);
    expect(receivedMaterial.name).toBeInstanceOf(Array);
    expect(receivedMaterial).toHaveProperty(
      'description',
      material.description
    );
    expect(receivedMaterial.description).toBeInstanceOf(Array);
    expect(receivedMaterial).toHaveProperty('purpose', material.purpose);
    expect(receivedMaterial).toHaveProperty('available', material.available);
    expect(receivedMaterial).toHaveProperty('colors', [
      {
        _id: colorId,
        ...color,
      },
    ]);
    expect(receivedMaterial.colors).toBeInstanceOf(Array);
  });
  it('should return error message when return not existing material', async () => {
    const {
      data: { getMaterialById: receivedMaterial },
    } = await getMaterialById(materialDoesNotExistId, operations);

    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toHaveProperty('statusCode', 404);
    expect(receivedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });
  it('Should receive 1 material', async () => {
    const {
      data: {
        getAllMaterials: { items, count },
      },
    } = await getAllMaterialsWithSkipAndLimit(skip, limit, operations);

    expect(items).toHaveLength(1);
    expect(count).not.toBeNull();
    expect(count).toEqual(1);
  });
  it('should receive error if skip is negative', async () => {
    const { errors } = await getAllMaterialsWithSkipAndLimit(
      wrongSkip,
      limit,
      operations
    );
    if (errors[0].message == graphqlErrorMessage)
      expect(errors[0].message).toEqual(graphqlErrorMessage);
    else
      expect(errors[0].message).toEqual(
        `BSON field 'skip' value must be >= 0, actual value '-5'`
      );
  });
  it('should receive 3 materials if limit is -3', async () => {
    const {
      data: {
        getAllMaterials: { items, count },
      },
    } = await getAllMaterialsWithSkipAndLimit(skip, wrongLimit, operations);
    expect(items).toHaveLength(1);
    expect(count).toEqual(1);
    expect(items).not.toBeNull();
  });
  it('should receive all materials if skip is 0 and limit is 0', async () => {
    const {
      data: {
        getAllMaterials: { items, count },
      },
    } = await getAllMaterialsWithSkipAndLimit(skip, limitZero, operations);

    expect(items).toHaveLength(1);
    expect(count).toEqual(1);
    expect(items).not.toBeNull();
  });

  afterAll(async () => {
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
  });
});
