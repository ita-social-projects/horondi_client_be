const looksSlide = {
  title: [
    {
      lang: 'ua',
      value: 'Бек тест',
    },
    {
      lang: 'en',
      value: 'Back test',
    },
  ],
  description: [
    {
      lang: 'ua',
      value: 'Бек тест',
    },
    {
      lang: 'en',
      value: 'Back test',
    },
  ],
  link: 'asdasd',
  images: {
    large: 'large_test-file',
    medium: 'medium_test-file',
    small: 'small_test-file',
    thumbnail: 'thumbnail_test-file',
  },
  order: 1,
  show: true,
};

const looksSlideUpdate = {
  title: [
    {
      lang: 'ua',
      value: 'Бек тест',
    },
  ],
  description: [
    {
      lang: 'ua',
      value: 'Бек тест',
    },
  ],
  link: 'https://localhost:3000',
  images: {
    large: 'large_test-file',
    medium: 'medium_test-file',
    small: 'small_test-file',
    thumbnail: 'thumbnail_test-file',
  },
  order: 3,
  show: false,
};

const updatedLooksSlide = {
  images: {
    large: 'large_0_test-file',
    medium: 'medium_0_test-file',
    small: 'small_0_test-file',
    thumbnail: 'thumbnail_0_test-file',
  },
};

const wrongId = '5f9ab9acc1446000240e9f6a';

const invalidId = '33а№4;%%"!№';

const maxCountOfAddingItems = 3;

module.exports = {
  looksSlide,
  updatedLooksSlide,
  wrongId,
  invalidId,
  maxCountOfAddingItems,
  looksSlideUpdate,
};
