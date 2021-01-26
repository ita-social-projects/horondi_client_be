const WRONG_ID = '600987de4cf8d95fa80ddf9b';

const COLOR = {
  name: [{ value: '222ddd', lang: 'UA' }],
  colorHex: '#3r56tg',
  simpleName: [{ value: '222ddd', lang: 'UA' }],
};

const ERROR_NOT_FOUND = { message: 'COLOR_NOT_FOUND', statusCode: 404 };

const ERROR_ALREDY_EXISTS = {
  message: 'COLOR_ALREADY_EXIST',
  statusCode: 400,
};

module.exports = {
  WRONG_ID,
  COLOR,
  COLOR_2,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
};
