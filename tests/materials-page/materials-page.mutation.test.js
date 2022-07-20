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
const image = 'img.jpg';

jest.mock('../../modules/upload/upload.service');

describe('MaterialsBlocks queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  afterAll(async () => deleteMaterialsBlock(materialsBlock._id, operations));

  it('should add material-about to database', async () => {
    materialsBlock = await addMaterialsBlock(
      newMaterialsBlock,
      image,
      operations
    );
    expect(materialsBlock.title).toEqual('title');
  });

  it('Should update material-about block without image', async () => {
    materialsBlock = await updateMaterialsBlock(
      materialsBlock._id,
      updatedMaterialsBlock,
      undefined,
      operations
    );

    expect(materialsBlock.title).toEqual('newTitle');
  });

  it('Should update material-about block', async () => {
    materialsBlock = await updateMaterialsBlock(
      materialsBlock._id,
      newMaterialsBlock,
      image,
      operations
    );

    expect(materialsBlock.title).toEqual('title');
  });

  it('delete material-about', async () => {
    const res = await deleteMaterialsBlock(materialsBlock._id, operations);

    materialsBlock = res.data.deleteMaterialsBlock;

    expect(materialsBlock).toHaveProperty('title', newMaterialsBlock.title);
  });
});
