const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { looksImage } = require('./homepage-images.variables');
const {
  addHomePageLooksImage,
  deleteHomePageLooksImage,
  getHomePageImages,
} = require('./homepage-images.helper');

jest.mock('../../modules/upload/upload.service');

let looksImageId;
let operations;

describe('Homepage looks images queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    looksImageId = await addHomePageLooksImage(operations);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Should receive all looks images', async () => {
    const getHomePageLooksImages = await getHomePageImages(operations);

    expect(getHomePageLooksImages).toBeDefined();
    expect(getHomePageLooksImages[0]).toHaveProperty(
      'images',
      looksImage.images
    );
  });

  afterAll(async () => {
    await deleteHomePageLooksImage(looksImageId, operations);
  });
});
