const { setupApp } = require('../helper-functions');
const { wrongId, looksSlide } = require('./homepage-slider.variables');
const {
  addHomePageSlide,
  deleteHomePageSlide,
  updateHomePageSlide,
} = require('./homepage-slider.helper');
const {
  SLIDE_NOT_FOUND,
} = require('../../error-messages/home-page-slider.messages');
// const { addSlide, updateSlide, deleteSlide } = require('../../modules/homepage-slider/homepage-slider.service');

jest.mock('../../modules/upload/upload.service');

let looksSlideId;
let operations;
// let slider;

describe('Homepage looks slider mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('Should create something', async () => {
    looksSlideId = await addHomePageSlide(looksSlide, operations);
    console.log(looksSlideId);
    expect(1).toBe(1);
  });

  it('Passing invalid ID should return error', async () => {
    const updateResult = await updateHomePageSlide(
      wrongId,
      looksSlide,
      operations
    );

    expect(updateResult).toHaveProperty('message', SLIDE_NOT_FOUND);
    expect(updateResult).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteHomePageSlide(looksSlideId, operations);
  });
});
