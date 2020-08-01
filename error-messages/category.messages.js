const CATEGORY_NOT_FOUND = [
  {
    lang: 'uk',
    value: 'Категорій не знайдено',
  },
  {
    lang: 'eng',
    value: 'Category not found',
  },
];

const CATEGORY_ALREADY_EXIST = JSON.stringify([
  { lang: 'uk', value: 'Категорія вже існує' },
  { lang: 'eng', value: 'Category already exist' },
]);

module.exports = { CATEGORY_NOT_FOUND, CATEGORY_ALREADY_EXIST };
