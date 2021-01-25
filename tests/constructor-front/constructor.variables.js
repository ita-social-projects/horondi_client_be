const { gql } = require('@apollo/client');
const { options } = require('@hapi/joi');
const { id } = require('date-fns/locale');
const { setupApp } = require('../helper-functions');

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

const createConstructorFrontPocket = async constructorInput => {
  operations = await setupApp();
  const ConstructorFrontPocket = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorFrontPocketInput!) {
        addConstructorFrontPocket(constructorElement: $constructorElement) {
          ... on ConstructorFrontPocket {
            _id
            available
            default
            basePrice {
              value
            }
            name {
              value
            }
            image
            material {
              name {
                value
              }
            }
            color {
              colorHex
              _id
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { constructorElement: constructorInput },
  });
  return ConstructorFrontPocket.data.addConstructorFrontPocket;
};

module.exports = {
  badConstructorFrontID,
  newColor,
  newMaterial,
  getConstructorData,
  createMaterial,
  createConstructorFrontPocket,
};
