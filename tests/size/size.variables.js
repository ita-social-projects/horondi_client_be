const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const SIZES_TO_CREATE = {
  size1: {
    name: 'S',
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    additionalPrice: 50,
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 36,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: 40,
  },
};

const SIZES_TO_TEST = {
  size1: {
    name: 'S',
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    additionalPrice: [
      { currency: 'UAH', value: 140753 },
      { currency: 'USD', value: 5000 },
    ],
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 36,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: [
      { currency: 'UAH', value: 140753 },
      { currency: 'USD', value: 5000 },
    ],
  },
};

const WRONG_ID = '600eb8c642952b055c148e34';

const ERROR_ALREDY_EXISTS = {
  message: 'SIZE_ALREADY_EXIST',
  statusCode: 404,
};

const ERROR_NOT_FOUND = {
  message: 'SIZE_NOT_FOUND',
  statusCode: 404,
};

const createSize = async size => {
  operations = await setupApp();
  const createdSize = await operations.mutate({
    mutation: gql`
      mutation($size: SizeInput!) {
        addSize(size: $size) {
          ... on Size {
            _id
          }
        }
      }
    `,
    variables: {
      size,
    },
  });
  return createdSize.data.addSize._id;
};

const deleteSize = async id => {
  operations = await setupApp();
  const deletedColor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteSize(id: $id) {
          ... on Size {
            _id
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return deletedColor.data.deleteSize._id;
};

module.exports = {
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_ALREDY_EXISTS,
  ERROR_NOT_FOUND,
  createSize,
  deleteSize,
};
