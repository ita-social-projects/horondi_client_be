const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const badProductId = '6009dcd5f9855555907ebf5e';

const newCategory = {
  available: true,
  name: [
    {
      value: 'Тестовенька категорія',
      lang: 'uk',
    },
    {
      value: 'Testy Category',
      lang: 'en',
    },
  ],
  code: 'new catyyy',
};

const newColor = {
  name: [
    { lang: 'ua', value: 'Світsadas' },
    { lang: 'en', value: 'blackdasdas' },
  ],
  colorHex: '#f47ac6',
  simpleName: [
    { lang: 'ua', value: 'Чорний' },
    { lang: 'en', value: 'black' },
  ],
};
const newProductInputData = (
  categoryId,
  modelId,
  mainMaterialId,
  innerMaterialId,
  colorId,
  patternId,
  closureId,
  sizeId
) => ({
  category: categoryId,
  model: modelId,
  name: [
    { lang: 'uk', value: 'тестовий продукт' },
    { lang: 'en', value: 'Some Product' },
  ],
  description: [
    { lang: 'uk', value: 'Приклад опису' },
    { lang: 'en', value: 'Description' },
  ],
  mainMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  innerMaterial: {
    material: innerMaterialId,
    color: colorId,
  },
  bottomMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  strapLengthInCm: 30,
  pattern: patternId,
  closure: closureId,
  basePrice: 200,
  sizes: [sizeId],
  available: true,
  availableCount: 20,
});
const newProductInputDataForUpdate = (
  categoryId,
  modelId,
  mainMaterialId,
  innerMaterialId,
  colorId,
  patternId,
  closureId,
  sizeId
) => ({
  category: categoryId,
  model: modelId,
  name: [
    { lang: 'uk', value: 'Нова назва' },
    { lang: 'en', value: 'new name' },
  ],
  description: [
    { lang: 'uk', value: 'новий опис' },
    { lang: 'en', value: 'new description' },
  ],
  mainMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  innerMaterial: {
    material: innerMaterialId,
    color: colorId,
  },
  bottomMaterial: {
    material: mainMaterialId,
    color: colorId,
  },
  strapLengthInCm: 99,
  pattern: patternId,
  closure: closureId,
  basePrice: 50,
  sizes: [sizeId],
  availableCount: 15,
});
const newProductInputDataForCompare = product => ({
  category: { _id: product.category },
  closure: { _id: product.closure },
  model: { _id: product.model },
  name: [
    {
      lang: product.name[0].lang,
      value: product.name[0].value,
    },
    {
      lang: product.name[1].lang,
      value: product.name[1].value,
    },
  ],
  description: [
    {
      lang: product.description[0].lang,
      value: product.description[0].value,
    },
    {
      lang: product.description[1].lang,
      value: product.description[1].value,
    },
  ],
  availableCount: product.availableCount,
  pattern: { _id: product.pattern },

  strapLengthInCm: product.strapLengthInCm,
  sizes: [{ _id: product.sizes[0] }],
  innerMaterial: {
    material: {
      _id: product.innerMaterial.material,
    },
    color: {
      _id: product.innerMaterial.color,
    },
  },
  mainMaterial: {
    material: {
      _id: product.mainMaterial.material,
    },
    color: {
      _id: product.mainMaterial.color,
    },
  },
  bottomMaterial: {
    material: {
      _id: product.bottomMaterial.material,
    },
    color: {
      _id: product.bottomMaterial.color,
    },
  },
});

module.exports = {
  badProductId,
  newCategory,
  newColor,
  newProductInputData,
  newProductInputDataForCompare,
  newProductInputDataForUpdate,
};
