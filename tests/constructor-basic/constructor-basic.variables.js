const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { deleteMaterial } = require('../materials/material.helper');
const { deleteColor } = require('../color/color.helper');
const { deleteConstructorBasic } = require('./constructor-basic.helper');
let operations;

const badConstructorBasicID = '6009dcd5f9855555907ebf5e';
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
const newConstructorBasic = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'варіант 1' },
    { lang: 'en', value: 'variant 1' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURL',
  available: true,
  default: false,
});
const newConstructorBasicUpdateInp = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'варіант 5' },
    { lang: 'en', value: 'variant 5' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURLkk',
  available: true,
  default: false,
});
const newMaterial = colorID => ({
  name: [
    { lang: 'ua', value: 'тканина кордура' },
    { lang: 'en', value: 'Cordura fabric' },
  ],
  description: [
    { lang: 'ua', value: 'описання' },
    { lang: 'en', value: 'some description' },
  ],
});

const getConstructorData = construrtorBasic => ({
  name: [
    {
      lang: construrtorBasic.name[0].lang,
      value: construrtorBasic.name[0].value,
    },
    {
      lang: construrtorBasic.name[1].lang,
      value: construrtorBasic.name[1].value,
    },
  ],
  material: { _id: construrtorBasic.material },
  color: { _id: construrtorBasic.color },
  image: construrtorBasic.image,
  available: construrtorBasic.available,
  default: construrtorBasic.default,
});

const getConstructorDataForUpt = construrtorBasic => ({
  name: [
    {
      lang: 'ua',
      value: 'ПІСЛЯ',
    },
    {
      lang: 'en',
      value: 'After',
    },
  ],
  material: construrtorBasic.material,
  color: construrtorBasic.color,
  image: '/new img',
  available: true,
  default: false,
});

const deleteAll = async (
  colorID,
  materialID,
  constructorBasicId,
  construrtorIDafter
) => {
  const operations = await setupApp();
  await deleteConstructorBasic(constructorBasicId, operations);
  await deleteConstructorBasic(construrtorIDafter, operations);
  await deleteMaterial(materialID, operations);
  await deleteColor(colorID, operations);
};

module.exports = {
  newColor,
  badConstructorBasicID,
  newMaterial,
  newConstructorBasic,
  deleteAll,
  getConstructorData,
  newConstructorBasicUpdateInp,
  getConstructorDataForUpt,
};
