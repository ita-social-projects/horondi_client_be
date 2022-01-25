const { newMaterialsBlock } = require('./materials-page.variables');
const { setupApp } = require('../helper-functions');

const {
  addMaterialsBlock,
  deleteMaterialsBlock,
} = require('./materials-page.helper');

let materialsBlocks;
let materialsBlockId;
let operations;

describe('MaterialsBlocks queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add add to database', async () => {
    materialsBlocks = await addMaterialsBlock(newMaterialsBlock, operations);

    expect(materialsBlocks).toHaveProperty('image', newMaterialsBlock.image);
    expect(materialsBlocks.heading).toEqual('New Material');
    expect(materialsBlocks).toHaveProperty(
      'heading',
      newMaterialsBlock.heading
    );
    expect(materialsBlocks.text).toEqual('New Text');
  });

  it('delete material-about', async () => {
    materialsBlockId = materialsBlocks._id;
    const res = await deleteMaterialsBlock(materialsBlockId, operations);
    materialsBlocks = res.data.deleteMaterialsBlock;
    expect(materialsBlocks).toHaveProperty('image', newMaterialsBlock.image);
    expect(materialsBlocks.heading).toEqual('New Material');
    expect(materialsBlocks).toHaveProperty('image', newMaterialsBlock.image);
  });
});
