const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { deleteMaterial } = require('../materials/material.helper');
const { deleteColor } = require('../color/color.helper');
const { deleteConstructorFrontPocket } = require('./constructor.front.helper');
let operations;

const badConstructorFrontID = '6009dcd5f9855555907ebf5e';

const newColor = {
  name: [
    { lang: 'ua', value: 'Білий' },
    { lang: 'en', value: 'White' },
  ],
  colorHex: '#81434d',
  simpleName: [
    { lang: 'ua', value: 'Білий' },
    { lang: 'en', value: 'White' },
  ],
};

const newConstructorFront = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'Щось' },
    { lang: 'en', value: 'Something' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURL',
  basePrice: 0,
  available: true,
  default: false,
});

const newConstructorFrontUpdateInp = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'Щось 2' },
    { lang: 'en', value: 'Something 2' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURL2',
  basePrice: 0,
  available: true,
  default: false,
});

const newMaterial = colorID => ({
  name: [
    { lang: 'ua', value: 'Тканина кордура' },
    { lang: 'en', value: 'Cordura fabric' },
  ],
  description: [
    { lang: 'ua', value: 'описання' },
    { lang: 'en', value: 'Corduras fabric' },
  ],
  purpose: 'some purpose',
  colors: colorID,
  available: true,
  additionalPrice: 0,
});

const getConstructorData = construrtorFront => ({
  name: [
    {
      lang: construrtorFront.name[0].lang,
      value: construrtorFront.name[0].value,
    },
    {
      lang: construrtorFront.name[1].lang,
      value: construrtorFront.name[1].value,
    },
  ],
  material: { _id: construrtorFront.material },
  color: { _id: construrtorFront.color },
  image: construrtorFront.image,
  available: construrtorFront.available,
  default: construrtorFront.default,
});

const getConstructorDataForUpt = ConstructorFrontPocket => ({
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
  material: ConstructorFrontPocket.material,
  color: ConstructorFrontPocket.color,
  image: '/new img',
  available: true,
  default: false,
});

const deleteAll = async (
  colorID,
  materialID,
  constructorFrontId,
  construrtorIDafter
) => {
  const operations = await setupApp();
  await deleteConstructorFrontPocket(constructorFrontId, operations);
  await deleteConstructorFrontPocket(construrtorIDafter, operations);
  await deleteMaterial(materialID, operations);
  await deleteColor(colorID, operations);
};

module.exports = {
  badConstructorFrontID,
  newColor,
  newMaterial,
  getConstructorData,
  newConstructorFront,
  newConstructorFrontUpdateInp,
  getConstructorDataForUpt,
  deleteAll,
};
