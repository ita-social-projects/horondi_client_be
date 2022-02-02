const { newMaterialsBlock } = require('./materials-page.variables');
const { setupApp } = require('../helper-functions');

const {
  addMaterialsBlock,
  deleteMaterialsBlock,
} = require('./materials-page.helper');

let materialsBlock;
let operations;

describe('MaterialsBlocks queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  afterAll(async () => deleteMaterialsBlock(materialsBlock._id, operations));

  it('should add material-about to database', async () => {
    materialsBlock = await addMaterialsBlock(newMaterialsBlock, operations);

    expect(materialsBlock.image).toEqual('url');
  });

  it('delete material-about', async () => {
    const res = await deleteMaterialsBlock(materialsBlock._id, operations);

    materialsBlock = res.data.deleteMaterialsBlock;

    expect(materialsBlock).toHaveProperty('image', newMaterialsBlock.image);
  });
});
