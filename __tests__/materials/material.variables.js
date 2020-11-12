const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const materialDoesNotExistId = '1f2ad410eb01783384e6111b';
const graphqlErrorMessage = 'Skip value must be non-negative, but received: -5';

const skip = 0;
const wrongSkip = -5;
const wrongLimit = -3;
const limit = 2;
const limitZero = 0;

const user = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const languageTypeName = { __typename: 'Language' };
const currencyTypeName = { __typename: 'CurrencySet' };
const imageTypeName = { __typename: 'ImageSet' };

const material = {
  name: [
    { lang: 'uk', value: 'Тест mutation' },
    { lang: 'en', value: 'Test mutation' },
  ],
  description: [
    { lang: 'uk', value: 'Опис test' },
    { lang: 'en', value: 'Description test' },
  ],
  purpose: 'test',
  available: true,
  additionalPrice: [
    { currency: 'UAH', value: 0 },
    { currency: 'USD', value: 0 },
  ],
  colors: [
    {
      code: 777,
      name: [
        { lang: 'uk', value: 'Тестовий колір' },
        { lang: 'en', value: 'Test color' },
      ],
      simpleName: [
        { lang: 'uk', value: 'проста назва кольору' },
        { lang: 'en', value: 'simple color name' },
      ],
      available: true,
      images: {
        large: 'large_test',
        medium: 'medium_test',
        small: 'small_test',
        thumbnail: 'thumbnail_test',
      },
    },
  ],
};
const materialToUpdate = {
  name: [
    { lang: 'uk', value: 'Тест mu ta tion' },
    { lang: 'en', value: 'Test mu ta tion' },
  ],
  description: [
    { lang: 'uk', value: 'Опис update' },
    { lang: 'en', value: 'Description update' },
  ],
  purpose: 'test update',
  available: true,
  additionalPrice: [
    { currency: 'UAH', value: 0 },
    { currency: 'USD', value: 0 },
  ],
  colors: [
    {
      code: 777,
      name: [
        { lang: 'uk', value: 'Тестовий колір update' },
        { lang: 'en', value: 'Test color update' },
      ],
      images: {
        large: 'large_test update',
        medium: 'medium_test update',
        small: 'small_test update',
        thumbnail: 'thumbnail_test update',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'проста назва кольору update' },
        { lang: 'en', value: 'simple color name update' },
      ],
    },
  ],
};

const materialWithExistingName = {
  name: [
    {
      lang: 'uk',
      value: 'Мальмо',
    },
    {
      lang: 'en',
      value: 'Malmo',
    },
  ],
  description: [
    { lang: 'uk', value: 'Опис update' },
    { lang: 'en', value: 'Description update' },
  ],
  purpose: 'test update',
  available: true,
  additionalPrice: [
    { currency: 'UAH', value: 0 },
    { currency: 'USD', value: 0 },
  ],
  colors: [
    {
      code: 777,
      name: [
        { lang: 'uk', value: 'Тестовий колір update' },
        { lang: 'en', value: 'Test color update' },
      ],
      images: {
        large: 'large_test update',
        medium: 'medium_test update',
        small: 'small_test update',
        thumbnail: 'thumbnail_test update',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'проста назва кольору update' },
        { lang: 'en', value: 'simple color name update' },
      ],
    },
  ],
};

module.exports = {
  materialDoesNotExistId,
  graphqlErrorMessage,
  skip,
  wrongSkip,
  wrongLimit,
  limit,
  limitZero,
  user,
  languageTypeName,
  currencyTypeName,
  imageTypeName,
  material,
  materialToUpdate,
  materialWithExistingName,
};
