const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
//const { getObjectId, getObjectIds } = require('mongo-seeding');

const categories = [
  {
    categoryCode: 'backpacks',
    name: mapToLanguages(['Рюкзаки', 'Backpacks']),
    images: mapToImages('backpack'),
    available: true
  },
  {
    categoryCode: 'bags',
    name: mapToLanguages(['Сумки', 'Bags']),
    images: mapToImages('bag'),
    available: true
  },
  {
    categoryCode: 'fanny-packs',
    name: mapToLanguages(['Бананки', 'Fanny packs']),
    images: mapToImages('fanny-pack'),
    available: true
  },
  {
    categoryCode: 'wallets',
    name: mapToLanguages(['Гаманці', 'Wallets']),
    images: mapToImages('wallet'),
    available: true
  },
  {
    categoryCode: 'laptop-cases',
    name: mapToLanguages(['Чехли для ноутбуків', 'Laptop cases']),
    images: mapToImages('laptop-case'),
    available: false
  }
];

module.exports = categories;