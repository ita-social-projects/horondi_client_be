const CONFIRMATION_ERROR = [
  {
    value: 'Ой! Щось пішло не так!',
  },
  {
    value: 'Oops! Something went wrong!',
  },
];

const NOT_CONFIRMED = [
  {
    value: 'Будь ласка, підтвердьте ваш профіль.',
  },
  {
    value: 'Please, confirm your profile.',
  },
];

const TOKEN_NOT_VALID = [
  {
    value: 'Токен підтвердження більше не активний.',
  },
  {
    value: 'This token is no longer valid.',
  },
];

const WRONG_CREDENTIALS = [
  {
    value: 'Невірний емейл або пароль',
  },
  {
    value: 'Wrong email or password',
  },
];

module.exports = {
  CONFIRMATION_ERROR,
  TOKEN_NOT_VALID,
  NOT_CONFIRMED,
  WRONG_CREDENTIALS,
};
