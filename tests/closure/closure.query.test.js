const { setupApp } = require('../helper-functions');
const { deleteClosure, createClosure } = require('./closure.helper');
const { wrongId, newClosure } = require('./closure.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { color } = require('../color/color.variables');
const { createColor, deleteColor } = require('../color/color.helper');

jest.mock('../../modules/upload/upload.service');

let operations;
let colorId;
let materialId;
let closureId;

describe('Closure queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const closureData = await createClosure(newClosure(materialId), operations);
    closureId = closureData._id;
  });

  // test('should recieve all sizes', async () => {
  //   const result = await getAllSizes(operations);
  //
  //   expect(result[0]).toEqual(SIZES_TO_TEST.size1);
  // });
  // test('should recieve sizes by ID', async () => {
  //   const result = await getSizeById(sizeId, operations);
  //
  //   expect(result).toEqual({
  //     _id: sizeId,
  //     ...SIZES_TO_TEST.size1,
  //   });
  // });

  afterAll(async () => {
    await deleteClosure(closureId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
  });
});
