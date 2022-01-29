const { newMaterialsBlock } = require('./materials-page.variables');
const { setupApp } = require('../helper-functions');

const {
  addMaterialsBlock,
  deleteMaterialsBlock,
} = require('./materials-page.helper');

let materialsBlocks;
let operations;

describe('MaterialsBlocks queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add material-about to database', async () => {
    materialsBlocks = await addMaterialsBlock(newMaterialsBlock, operations);

    expect(materialsBlocks.image).toEqual('url');
  });

  it('delete material-about', async () => {
    const res = await deleteMaterialsBlock(materialsBlocks._id, operations);

    materialsBlocks = res.data.deleteMaterialsBlock;

    expect(materialsBlocks).toHaveProperty('image', newMaterialsBlock.image);
  });
});
