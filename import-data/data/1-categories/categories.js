const { mapToLanguages } = require('../../helpers/languages');
const { mapToImages } = require('../../helpers/images');
const { getObjectId, getObjectIds } = require('mongo-seeding');

let categories = [];

mapToCategories('main-backpacks', ['Рюкзаки', 'Backpacks'], 'https://horondi.blob.core.windows.net/horondi/categories/backpacks.jpg', ['sub-backpacks']);
mapToCategories('sub-backpacks', ['Рюкзаки', 'Backpacks'], '', []);
mapToCategories('main-bags', ['Сумки', 'Bags'], 'https://horondi.blob.core.windows.net/horondi/categories/bags.jpg', ['sub-bags', 'sub-fanny-packs']);
mapToCategories('sub-bags', ['Сумки', 'Bags'], '', []);
mapToCategories('sub-fanny-packs', ['Бананки', 'Fanny packs'], '', []);
mapToCategories('main-accessories', ['Аксесуари', 'Accessories'], 'https://horondi.blob.core.windows.net/horondi/categories/accessories.jpg', ['sub-wallets', 'sub-laptop-cases']);
mapToCategories('sub-wallets', ['Гаманці', 'Wallets'], '', []);
mapToCategories('sub-laptop-cases', ['Чехли для ноутбуків', 'Laptop cases'], '', []);
mapToCategories('none', ['Немає', 'None'], '', []);

function mapToCategories(code, name, image, subCodes){
  categories.push({
    id: getObjectId(code),
    code: code,
    name: mapToLanguages(name),
    images: (image.length === 0) ? mapToImages(code) : { large: image },
    subcategories: getObjectIds(subCodes),
    isMain: (subCodes.length === 0) ? false : true,
    available: (code === 'sub-laptop-cases') ? false : true
  })
}

module.exports = categories;