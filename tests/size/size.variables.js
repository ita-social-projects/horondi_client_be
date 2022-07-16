const SIZES_TO_CREATE = {
  size1: {
    name: 'S',
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
};

const createPlainSize = () => [
  {
    name: 'S',
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
  {
    name: 'M',
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
];

const SIZES_TO_TEST = {
  size1: {
    name: 'S',

    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
};

const createTestSize = () => ({
  size1: {
    name: 'S',
    heightInCm: 35,
    widthInCm: 26,
    depthInCm: 14,
    volumeInLiters: 5,
    weightInKg: 0.8,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
  },
  size2: {
    name: 'M',
    heightInCm: 25,
    widthInCm: 35,
    depthInCm: 12,
    volumeInLiters: 7,
    weightInKg: 0.6,
    available: true,
    absolutePrice: 10,
    relativePrice: null,
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
