const { setupApp } = require('../helper-functions');
const {
  getAllMaterialsBlocks,
  addMaterialsBlock,
  deleteMaterialsBlock,
  getMaterialsBlockById,
} = require('./materials-page.helper');
const { newMaterialsBlock } = require('./materials-page.variables');

let materialsBlock;
let operations;

describe('Materials-about block queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    materialsBlock = await addMaterialsBlock(newMaterialsBlock, operations);
  });

  afterAll(async () => {
    await deleteMaterialsBlock(materialsBlock._id, operations);
  });

  it('Should get all materials-about blocks', async () => {
    const blocks = await getAllMaterialsBlocks(
      { skip: 0, limit: 0 },
      operations
    );

    expect(blocks.items.length).toBe(1);
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
