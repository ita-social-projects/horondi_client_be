const wrongId = '600987de4cf8d95fa80ddf9b';
const color = {
  name: [
    { value: '222ddd', lang: 'UA' },
    { value: '222ddd', lang: 'EN' },
  ],
  colorHex: '#3r56tg',
  simpleName: [
    { value: '222ddd', lang: 'UA' },
    { value: '222ddd', lang: 'EN' },
  ],
};
const ERROR_NOT_FOUND = { message: 'COLOR_NOT_FOUND', statusCode: 404 };
const ERROR_ALREDY_EXISTS = {
  message: 'COLOR_ALREADY_EXIST',
  statusCode: 400,
};

module.exports = {
  wrongId,
  color,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
};
