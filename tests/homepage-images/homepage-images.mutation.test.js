const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { wrongId } = require('./homepage-images.variables');
const {
  addHomePageLooksImage,
  deleteHomePageLooksImage,
  updateHomePageLooksImage,
} = require('./homepage-images.helper');
const { IMAGE_NOT_FOUND } = require('../../error-messages/home-page-messages');

jest.mock('../../modules/upload/upload.service');

let looksImageId;
let operations;

describe('Homepage looks images mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    looksImageId = await addHomePageLooksImage(operations);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Passing invalid ID should return error', async () => {
    const updateResult = await updateHomePageLooksImage(wrongId, operations);

    expect(updateResult).toHaveProperty('message', IMAGE_NOT_FOUND);
    expect(updateResult).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteHomePageLooksImage(looksImageId, operations);
  });
});
