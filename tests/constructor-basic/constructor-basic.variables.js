const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/currency/currency.utils.js');
let operations;
/// тестовий колір
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
const newConstructorBasic = materialID => ({
  material: materialID,
  name: [
    { lang: 'ua', value: 'варіант 1' },
    { lang: 'en', value: 'variant 1' },
  ],
  //"basePrice": 0,
  available: true,
});
const newMaterial = colorID => ({
  name: [
    { lang: 'ua', value: 'тканина кордура' },
    { lang: 'en', value: 'Cordura fabric' },
  ],
  colors: colorID,
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
  available: construrtorBasic.available,
});

const createColor = async newColor => {
  operations = await setupApp();
  const addColor = await operations.mutate({
    mutation: gql`
      mutation($data: ColorInput!) {
        addColor(data: $data) {
          ... on Color {
            _id
            name {
              lang
              value
            }
            colorHex
            simpleName {
              lang
              value
            }
          }
        }
      }
    `,
    variables: { data: newColor },
  });
  const colorID = addColor.data.addColor._id;
  return colorID;
};
const createMaterial = async newMaterial => {
  operations = await setupApp();
  const addMaterial = await operations.mutate({
    mutation: gql`
      mutation($material: MaterialInput!) {
        addMaterial(material: $material) {
          ... on Material {
            _id
            name {
              lang
              value
            }
            colors {
              _id
            }
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
            available
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

const deleteAll = async (colorID, materialID, constructorBasicID) => {
  const operations = await setupApp();
  const deleteColor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteColor(id: $id) {
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
    variables: { id: constructorBasicID },
  });

  return { deleteColor, deleteMaterial, deleteConstructorBasic };
};

module.exports = {
  newColor,
  newMaterial,
  createMaterial,
  createColor,
  newConstructorBasic,
  deleteAll,
  getConstructorData,
  createConstructorBasic,
  badConstructorBasicID,
};
