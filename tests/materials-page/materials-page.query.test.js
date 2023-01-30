const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const {
  getAllMaterialsBlocks,
  addMaterialsBlock,
  deleteMaterialsBlock,
  getMaterialsBlockById,
  getMaterialsBlocksByType,
} = require('./materials-page.helper');
const { newMaterialsBlock } = require('./materials-page.variables');

jest.mock('../../modules/upload/upload.service');

let materialsBlock;
let operations;
const image = 'img.jpg';

describe('Materials-about block queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    materialsBlock = await addMaterialsBlock(
      newMaterialsBlock,
      image,
      operations
    );
  });

  afterAll(async () => {
    await deleteMaterialsBlock(materialsBlock._id, operations);
    await mongoose.connection.db.dropDatabase();
  });

  it('Should get all materials-about blocks', async () => {
    const blocks = await getAllMaterialsBlocks(
      { skip: 0, limit: 0 },
      operations
    );

    expect(blocks.items.length).toBe(1);
  });

  it('Should get materials-about blocks by type', async () => {
    const blocks = await getMaterialsBlocksByType(
      { type: 'bottom', limit: 0, skip: 0 },
      operations
    );

    expect(blocks.items.length).toBe(1);
  });

  it('Should do not get materials-about blocks filtering by type', async () => {
    const blocks = await getMaterialsBlocksByType(
      { type: 'main', limit: 0, skip: 0 },
      operations
    );

    expect(blocks.items.length).toBe(0);
  });

  it('Should do not get materials-about blocks by search text', async () => {
    const blocks = await getMaterialsBlocksByType(
      { type: 'bottom', limit: 0, skip: 0, filter: { search: 'heading' } },
      operations
    );

    expect(blocks.items.length).toBe(0);
  });

  it('Should get selected materials-about block', async () => {
    const selectedMaterialsBlock = await getMaterialsBlockById(
      materialsBlock._id,
      operations
    );

    expect(selectedMaterialsBlock).toHaveProperty(
      'text',
      newMaterialsBlock.text
    );
  });
});
