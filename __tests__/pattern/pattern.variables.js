const patternDoesNotExistId = '5f311ec5f2983e390432a8c3';
const skip = 0;
const wrongSkip = -1;
const wrongLimit = -5;
const limit = 5;

const user = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
};
const languageTypeName = { __typename: 'Language' };
const imageTypeName = { __typename: 'ImageSet' };

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
  patternToUpdate,
  patternAlreadyExist,
  patternDoesNotExistId,
  user,
  skip,
  limit,
  wrongSkip,
  wrongLimit,
  languageTypeName,
  imageTypeName,
  queryPatternToAdd,
  mutationPatternToAdd,
};
