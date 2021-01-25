const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
let operations;

const wrongID = '6009dcd5f9855555907ebf5e';
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
  basePrice: 0,
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
  basePrice: 0,
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
  purpose: 'some purpose',
  colors: colorID,
  available: true,
  additionalPrice: 0,
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
const getConstructorDataBeforeUpt = construrtorBasic => ({
  name: [
    {
      lang: construrtorBasic.name[0].lang,
      value: 'Назва до оновлення',
    },
    {
      lang: construrtorBasic.name[1].lang,
      value: 'Before update name',
    },
  ],
  material: construrtorBasic.material,
  color: construrtorBasic.color,
  image: construrtorBasic.image,
  available: false,
  default: false,
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
const getConstructorDataForUptCompare = construrtorBasic => ({
  _id: construrtorBasic._id,
  available: construrtorBasic.available,
  color: construrtorBasic.color._id,
  default: construrtorBasic.default,
  material: construrtorBasic.material._id,
  image: construrtorBasic.image,
  name: construrtorBasic.name,
});

const createMaterial = async newMaterial => {
  operations = await setupApp();
  const addMaterial = await operations.mutate({
    mutation: gql`
      mutation($material: MaterialInput!) {
        addMaterial(material: $material) {
          ... on Material {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { material: newMaterial },
  });
  return addMaterial.data.addMaterial._id;
};
const createConstructorBasic = async constructorInput => {
  operations = await setupApp();
  const constructorBasic = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBasicInput!) {
        addConstructorBasic(constructorElement: $constructorElement) {
          ... on ConstructorBasic {
            _id
            name {
              lang
              value
            }
            material {
              _id
            }
            color {
              _id
            }
            image
            basePrice {
              value
            }
            available
            default
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { constructorElement: constructorInput },
  });
  return constructorBasic.data.addConstructorBasic;
};

const deleteAll = async (colorID, materialID, constructorBasicId) => {
  const operations = await setupApp();

  const deleteConstructorBasic = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorBasic(id: $id) {
          ... on ConstructorBasic {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: constructorBasicId },
  });
  const deleteMaterial = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteMaterial(id: $id) {
          ... on Material {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: materialID },
  });

  const deleteColor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
          __typename
          ... on Color {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: colorID },
  });

  return { deleteColor, deleteMaterial, deleteConstructorBasic };
};

module.exports = {
  newColor,
  wrongID,
  newMaterial,
  createMaterial,
  newConstructorBasic,
  deleteAll,
  getConstructorData,
  createConstructorBasic,
  getConstructorDataBeforeUpt,
  newConstructorBasicUpdateInp,
  getConstructorDataForUpt,
  getConstructorDataForUptCompare,
};
