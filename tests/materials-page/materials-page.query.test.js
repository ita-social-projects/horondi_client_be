const { setupApp } = require('../helper-functions');
const { getAllMaterialsBlocks } = require('./materials-page.helper');

describe('Materials-about queries', () => {
  it('Should get all materials-blocks', async () => {
    const operations = await setupApp();
    const blocks = await getAllMaterialsBlocks(operations);
    expect(blocks).toBeDefined();
    expect(blocks.items).toBeInstanceOf(Array);
  });
});
