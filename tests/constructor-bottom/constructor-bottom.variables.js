const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
let operations;

const wrongID = '6009dcd5f9855555907ebf5e';

const color = {
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

const newMaterial = colorID => ({
  name: [
    { lang: 'ua', value: 'тканина кордура' },
    { lang: 'en', value: 'Cordura fabric' },
  ],
  description: [
    { lang: 'ua', value: 'описання' },
    { lang: 'en', value: 'some description' },
  ],
  purpose: 'INNER',
  colors: colorID,
  available: true,
});

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

  const deleteConstructorBottom = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorBottom(id: $id) {
          ... on ConstructorBottom {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id: constructorBottomID },
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

const createConstructorBottomQuery = async addConstructor => {
  const operations = await setupApp();
  const createConstructorBottom = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBottomInput!) {
        addConstructorBottom(constructorElement: $constructorElement) {
          ... on ConstructorBottom {
            _id
            name {
              lang
              value
            }
            material {
              _id
            }
            image
            color {
              _id
            }
            available
            default
          }
        }
      }
    `,
    variables: { constructorElement: addConstructor },
  });
  return createConstructorBottom.data.addConstructorBottom._id;
};
module.exports = {
  color,
  wrongID,
  newMaterial,
  newConstructorBottom,
  getConstructorData,
  deleteAll,
  getConstructorDataForUpt,
  createConstructorBottomQuery,
};
