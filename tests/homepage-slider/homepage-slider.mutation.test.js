const { setupApp } = require('../helper-functions');

const { wrongId, looksSlide } = require('./homepage-slider.variables');

const {
  addHomePageSlide,
  deleteHomePageSlide,
  updateHomePageSlide,
} = require('./homepage-slider.helper');

const {
  SLIDE_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/home-page-slider.messages');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

jest.mock('../../modules/upload/upload.service');

let looksSlideId;
let operations;

describe('Homepage looks slider mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('Should create slide', async () => {
    looksSlideId = (await addHomePageSlide(looksSlide, true, operations))._id;

    expect(looksSlideId).toBeDefined();
  });

  it('Creating slide without upload should return error', async () => {
    const errorLooksSlide = await addHomePageSlide(
      looksSlide,
      false,
      operations
    );

    expect(errorLooksSlide).toHaveProperty('message', IMAGE_NOT_PROVIDED);
    expect(errorLooksSlide).toHaveProperty('statusCode', BAD_REQUEST);
  });

  it('Passing invalid ID to update should return error', async () => {
    const updateResult = await updateHomePageSlide(
      wrongId,
      looksSlide,
      operations
    );

    expect(updateResult).toHaveProperty('message', SLIDE_NOT_FOUND);
    expect(updateResult).toHaveProperty('statusCode', NOT_FOUND);
  });

  it('Passing invalid ID to delete should return error', async () => {
    const deleteResult = await deleteHomePageSlide(wrongId, operations);

    expect(deleteResult).toHaveProperty('message', SLIDE_NOT_FOUND);
    expect(deleteResult).toHaveProperty('statusCode', NOT_FOUND);
  });

  afterAll(async () => {
    await deleteHomePageSlide(looksSlideId, operations);
  });
});
