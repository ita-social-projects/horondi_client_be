const { setupApp } = require('../helper-functions');
const { looksSlide } = require('./homepage-slider.variables');
const {
  addHomePageSlide,
  deleteHomePageSlide,
  // getAllHomePageSlides,
  getSlideById,
} = require('./homepage-slider.helper');

jest.mock('../../modules/upload/upload.service');

const looksSlidesIds = [];
let operations;

describe('Homepage looks images queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    for (let i = 0; i < 3; i++) {
      looksSlidesIds.push(await addHomePageSlide(looksSlide, operations));
    }
  });

  it('Should receive all looks slides', async () => {
    const homePageSlide = await getSlideById(looksSlidesIds[0], operations);

    expect(homePageSlide).toBeDefined();
    expect(homePageSlide).toHaveProperty('images', looksSlide.images);
  });

  it('Should two el in arr', () => {
    console.log(looksSlidesIds.length);
    expect(looksSlidesIds).toBeDefined();
    expect(looksSlidesIds.length).toBe(3);
  });

  afterAll(async () => {
    while (looksSlidesIds.length > 0) {
      const looksSlideId = looksSlidesIds.pop();
      await deleteHomePageSlide(looksSlideId, operations);
    }
  });
});
