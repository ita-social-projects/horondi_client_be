const {
  newMaterialsBlock,
  updatedMaterialsBlock,
} = require('./materials-page.variables');
const { setupApp } = require('../helper-functions');

const {
  addMaterialsBlock,
  deleteMaterialsBlock,
  updateMaterialsBlock,
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

  it('Should update material-about block', async () => {
    materialsBlock = await updateMaterialsBlock(
      materialsBlock._id,
      updatedMaterialsBlock,
      operations
    );

    expect(materialsBlock.type).toEqual('main');
  });

  it('delete material-about', async () => {
    const res = await deleteMaterialsBlock(materialsBlock._id, operations);

    materialsBlock = res.data.deleteMaterialsBlock;

    expect(materialsBlock).toHaveProperty('image', newMaterialsBlock.image);
  });
});
