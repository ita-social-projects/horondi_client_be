const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const categories = [
  {
    categoryCode: 'main-backpacks',
    name: mapToLanguages(['Рюкзаки', 'Backpacks']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/backpacks.jpg' },
    subcategories: [
      {
        id: getObjectId('subcategory1'),
        categoryCode: 'sub-backpacks',
        name: mapToLanguages(['Рюкзаки', 'Backpacks']),
        images: mapToImages('sub-backpack'),
        available: true
      }
    ],
    available: true
  },
  {
    categoryCode: 'main-bags',
    name: mapToLanguages(['Сумки', 'Bags']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/bags.jpg' },
    subcategories: [
      {
        id: getObjectId('subcategory2'),
        categoryCode: 'sub-bags',
        name: mapToLanguages(['Сумки', 'Bags']),
        images: mapToImages('sub-bag'),
        available: true
      },
      {
        id: getObjectId('subcategory3'),
        categoryCode: 'sub-fanny-packs',
        name: mapToLanguages(['Бананки', 'Fanny packs']),
        images: mapToImages('sub-fanny-pack'),
        available: true
      }
    ],
    available: true
  },
  {
    categoryCode: 'main-accessories',
    name: mapToLanguages(['Аксесуари', 'Accessories']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/accessories.jpg' },
    subcategories: [
        {
          id: getObjectId('subcategory4'),
          categoryCode: 'sub-wallets',
          name: mapToLanguages(['Гаманці', 'Wallets']),
          images: mapToImages('sub-wallet'),
          available: true
        },
        {
          id: getObjectId('subcategory5'),
          categoryCode: 'sub-laptop-cases',
          name: mapToLanguages(['Чехли для ноутбуків', 'Laptop cases']),
          images: mapToImages('sub-laptop-case'),
          available: false
        }
    ],
    available: true
  }
];

module.exports = categories;