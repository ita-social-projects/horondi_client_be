const CURRENCY_NOT_FOUND = [
  {
    lang: 'uk',
    value: 'Валюту не знайдено',
  },
  {
    lang: 'eng',
    value: 'Currency not found',
  },
];

const CURRENCY_ALREADY_EXIST = JSON.stringify([
  { lang: 'uk', value: 'Валюта вже існує' },
  { lang: 'eng', value: 'Currency already exist' },
]);
module.exports = { CURRENCY_NOT_FOUND, CURRENCY_ALREADY_EXIST };
