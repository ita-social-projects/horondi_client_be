const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const patternDoesNotExistId = '5f311ec5f2983e390432a8c3';
const skip = 0;
const wrongSkip = -1;
const wrongLimit = -5;
const limit = 5;

const user = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const testImages = {
  large: 'large_0_test-file',
  medium: 'medium_0_test-file',
  small: 'small_0_test-file',
  thumbnail: 'thumbnail_0_test-file',
};

const testValue = 'test value';
const updateValue = 'update value';
const mutationPatternToAdd = {
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
  material: 'test',
  handmade: false,
  available: true,
};

const queryPatternToAdd = {
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
  material: 'test',
  handmade: false,
  available: true,
};

const patternToUpdate = {
  name: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
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
  images: {
    large: 'update',
    medium: 'update',
    small: 'update',
    thumbnail: 'update',
  },
  material: 'update',
  available: true,
  handmade: false,
};

const imageTypeName = {
  large: 'large_0_test-file',
  medium: 'medium_0_test-file',
  small: 'small_0_test-file',
  thumbnail: 'thumbnail_0_test-file',
};

module.exports = {
  patternToUpdate,
  patternDoesNotExistId,
  user,
  skip,
  limit,
  wrongSkip,
  wrongLimit,
  queryPatternToAdd,
  mutationPatternToAdd,
  imageTypeName,
  testImages,
};
