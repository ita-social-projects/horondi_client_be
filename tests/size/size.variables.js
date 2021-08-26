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
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: 40,
  },
};

const createPlainSize = modelId => ({
  size1: {
    name: 'S',
    modelId,
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
    modelId,
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: 40,
  },
});

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
      {
        currency: 'UAH',
        value: 0,
      },
      null,
    ],
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: [
      {
        currency: 'UAH',
        value: 0,
      },
      null,
    ],
  },
};

const createTestSize = modelId => ({
  size1: {
    name: 'S',
    modelId: {
      _id: modelId,
    },
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    additionalPrice: [
      {
        currency: 'UAH',
        value: 0,
      },
      null,
    ],
  },
  size2: {
    name: 'M',
    modelId: {
      _id: modelId,
    },
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    additionalPrice: [
      {
        currency: 'UAH',
        value: 0,
      },
      null,
    ],
  },
});

const WRONG_ID = '600f20d51754387390b17fdA';
const ERROR_NOT_FOUND = {
  message: 'SIZE_NOT_FOUND',
  statusCode: 404,
};

module.exports = {
  createPlainSize,
  createTestSize,
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_NOT_FOUND,
};
