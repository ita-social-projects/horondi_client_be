const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { deleteColor } = require('../color/color.helper');
const { deleteConstructorBottom } = require('./constructor-bottom.helper');
const { deleteMaterial } = require('../materials/material.helper');

const newConstructorBottom = (colorId, materialId) => ({
  name: [
    { lang: 'ua', value: 'Деяке імя' },
    { lang: 'en', value: 'Some name' },
  ],
  material: materialId,
  image: 'askjfsdgfaowifjsklfjlsfkjl',
  basePrice: 1,
  color: colorId,
  available: true,
  default: true,
});

const getConstructorData = construrtor => ({
  name: [
    {
      lang: construrtor.name[0].lang,
      value: construrtor.name[0].value,
    },
    {
      lang: construrtor.name[1].lang,
      value: construrtor.name[1].value,
    },
  ],
  material: { _id: construrtor.material },
  color: { _id: construrtor.color },
  image: construrtor.image,
  available: construrtor.available,
  default: construrtor.default,
});

const deleteAll = async (colorID, materialID, constructorBottomID) => {
  const operations = await setupApp();
  await deleteConstructorBottom(constructorBottomID, operations);
  await deleteMaterial(materialID, operations);
  await deleteColor(colorID, operations);
  return { deleteColor, deleteMaterial, deleteConstructorBottom };
};

const getConstructorDataForUpt = (materialId, colorId) => ({
  name: [
    { lang: 'ua', value: 'Деяке нове імя' },
    { lang: 'en', value: 'Some new name' },
  ],
  material: materialId,
  image: '/sdasdafasd',
  basePrice: 1,
  color: colorId,
  available: true,
  default: true,
});

module.exports = {
  newConstructorBottom,
  getConstructorData,
  deleteAll,
  getConstructorDataForUpt,
};
