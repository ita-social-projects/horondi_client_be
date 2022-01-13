const {
  HEADER_ALREADY_EXIST,
  HEADER_NOT_FOUND,
} = require('../../error-messages/header.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const wrongId = '600987de4cf8d95fa80ddf9b';
const firstHeader = {
  title: [
    {
      lang: 'ua',
      value: 'Аксесуари',
    },
    {
      lang: 'en',
      value: 'Accessories',
    },
  ],
  link: '/accessories',
  priority: 1,
};
const secondHeader = {
  title: [
    {
      lang: 'ua',
      value: 'Рюкзаки',
    },
    {
      lang: 'en',
      value: 'Backpacks',
    },
  ],
  link: '/accessories',
  priority: 1,
};
const ERROR_NOT_FOUND = { message: HEADER_NOT_FOUND, statusCode: NOT_FOUND };
const ERROR_ALREADY_EXISTS = {
  message: HEADER_ALREADY_EXIST,
  statusCode: BAD_REQUEST,
};

module.exports = {
  wrongId,
  firstHeader,
  secondHeader,
  ERROR_ALREADY_EXISTS,
  ERROR_NOT_FOUND,
};
