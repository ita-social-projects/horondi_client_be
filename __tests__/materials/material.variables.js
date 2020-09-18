require('dotenv').config();

const user = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
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
      images: {
        large: 'large_test',
        medium: 'medium_test',
        small: 'small_test',
        thumbnail: 'thumbnail_test',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'проста назва кольору' },
        { lang: 'en', value: 'simple color name' },
      ],
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

const skip = 0;
const limit = 5;
const limitZero = 0;
const wrongSkip = -5;
const wrongLimit = -3;

module.exports = {
  user,
  material,
  materialToUpdate,
  materialWithExistingName,
  languageTypeName,
  currencyTypeName,
  imageTypeName,
  skip,
  limit,
  wrongSkip,
  wrongLimit,
  limitZero,
};
