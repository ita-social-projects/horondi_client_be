const { setupApp } = require('../helper-functions');

const {
  looksSlide,
  maxCountOfAddingItems,
  wrongId,
  invalidId,
} = require('./homepage-slider.variables');

const {
  addHomePageSlide,
  deleteHomePageSlide,
  getAllHomePageSlides,
  getSlideById,
} = require('./homepage-slider.helper');

const {
  SLIDE_NOT_VALID,
  SLIDE_NOT_FOUND,
} = require('../../error-messages/home-page-slider.messages');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

jest.mock('../../modules/upload/upload.service');

const looksSlidesIds = [];
let operations;

describe('Homepage looks slider queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    for (let i = 0; i < maxCountOfAddingItems; i++) {
      const looksSlideId = (
        await addHomePageSlide(looksSlide, true, operations)
      )._id;
      looksSlidesIds.push(looksSlideId);
    }
  });

  it('Should receive looks slide', async () => {
    const homePageSlide = await getSlideById(looksSlidesIds[0], operations);

    expect(homePageSlide).toBeDefined();
    expect(homePageSlide).toHaveProperty('images', looksSlide.images);
  });

  it('Should receive error', async () => {
    const homePageSlide = await getSlideById(invalidId, operations);

    expect(homePageSlide).toHaveProperty('message', SLIDE_NOT_VALID);
    expect(homePageSlide).toHaveProperty('statusCode', BAD_REQUEST);
  });

  it('Passing invalid ID on getting should return error', async () => {
    const homePageSlide = await getSlideById(wrongId, operations);

    expect(homePageSlide).toHaveProperty('message', SLIDE_NOT_FOUND);
    expect(homePageSlide).toHaveProperty('statusCode', NOT_FOUND);
  });

  it('Should receive all look slides', async () => {
    const homePageSlides = await getAllHomePageSlides(
      maxCountOfAddingItems + 1,
      100,
      operations,
    );

    expect(homePageSlides).toBeDefined();
    expect(homePageSlides.count).toBe(maxCountOfAddingItems);
    expect(homePageSlides.items).toEqual([]);
  });

  afterAll(async () => {
    while (looksSlidesIds.length > 0) {
      const looksSlideId = looksSlidesIds.pop();
      await deleteHomePageSlide(looksSlideId, operations);
    }
  });
});
