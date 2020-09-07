const patternToAdd = {
  name: [
    {
      lang: 'uk',
      value: 'test',
    },
    {
      lang: 'en',
      value: 'test',
    },
  ],
  description: [
    {
      lang: 'uk',
      value: 'test',
    },
    {
      lang: 'en',
      value: 'test',
    },
  ],
  images: {
    large: 'large_335nr4j5dkebkw5cy_test.jpg',
    medium: 'medium_335nr4j5dkebkw5cy_test.jpg',
    small: 'small_335nr4j5dkebkw5cy_test.jpg',
    thumbnail: 'thumbnail_335nr4j5dkebkw5cy_test.jpg',
  },
  material: 'test',
  handmade: false,
  available: true,
};

const patternToUpdate = {
  name: [
    {
      lang: 'uk',
      value: 'test',
    },
    {
      lang: 'en',
      value: 'pattest',
    },
  ],
  description: [
    {
      lang: 'uk',
      value: 'updated тестовий опис',
    },
    {
      lang: 'en',
      value: 'updated test description',
    },
  ],
};

const patternAlreadyExist = {
  name: [
    {
      lang: 'uk',
      value: 'Синій',
    },
    {
      lang: 'en',
      value: 'Blue',
    },
  ],

  material: 'Cordura',
  handmade: true,
  available: true,
};
module.exports = { patternToAdd, patternToUpdate, patternAlreadyExist };
