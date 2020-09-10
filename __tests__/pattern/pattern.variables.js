const user = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
};
const testValue = 'test value';
const updateValue = 'update value';
const patternToAdd = {
  name: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
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
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
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
module.exports = {
  patternToAdd,
  patternToUpdate,
  patternAlreadyExist,
  user,
  testValue,
  updateValue,
};
