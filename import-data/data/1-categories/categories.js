const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

const categories = [
  {
    code: 'main-backpacks',
    name: mapToLanguages(['Рюкзаки', 'Backpacks']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/backpacks.jpg' },
    subcategories: [
      getObjectId('sub-backpacks')
    ],
    isMain: true,
    available: true
  },
  {
    id: getObjectId('sub-backpacks'),
    code: 'sub-backpacks',
    name: mapToLanguages(['Рюкзаки', 'Backpacks']),
    images: mapToImages('sub-backpack'),
    subcategories: [],
    isMain: false,
    available: true
  },
  {
    code: 'main-bags',
    name: mapToLanguages(['Сумки', 'Bags']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/bags.jpg' },
    subcategories: [
      getObjectId('sub-bags'),
      getObjectId('sub-fanny-packs'),
    ],
    isMain: true,
    available: true
  },
  {
    id: getObjectId('sub-bags'),
    code: 'sub-bags',
    name: mapToLanguages(['Сумки', 'Bags']),
    images: mapToImages('sub-bag'),
    subcategories: [],
    isMain: false,
    available: true
  },
  {
    id: getObjectId('sub-fanny-packs'),
    code: 'sub-fanny-packs',
    name: mapToLanguages(['Бананки', 'Fanny packs']),
    images: mapToImages('sub-fanny-pack'),
    subcategories: [],
    isMain: false,
    available: true
  },
  {
    code: 'main-accessories',
    name: mapToLanguages(['Аксесуари', 'Accessories']),
    images: { large: 'https://horondi.blob.core.windows.net/horondi/categories/accessories.jpg' },
    subcategories: [
      getObjectId('sub-wallets'),
      getObjectId('sub-laptop-cases'),
    ],
    isMain: true,
    available: true
  },
  {
    id: getObjectId('sub-wallets'),
    code: 'sub-wallets',
    name: mapToLanguages(['Гаманці', 'Wallets']),
    images: mapToImages('sub-wallet'),
    subcategories: [],
    isMain: false,
    available: true
  },
  {
    id: getObjectId('sub-laptop-cases'),
    code: 'sub-laptop-cases',
    name: mapToLanguages(['Чехли для ноутбуків', 'Laptop cases']),
    images: mapToImages('sub-laptop-case'),
    subcategories: [],
    isMain: false,
    available: false
  }
];

module.exports = categories;