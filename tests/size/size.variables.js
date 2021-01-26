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
      { currency: 'UAH', value: 112603 },
      { currency: 'USD', value: 4000 },
    ],
  },
};

const WRONG_ID = '600f20d51754387390b17fdA';

const ERROR_ALREDY_EXISTS = {
  message: 'SIZE_ALREADY_EXIST',
  statusCode: 404,
};

const ERROR_NOT_FOUND = {
  message: 'SIZE_NOT_FOUND',
  statusCode: 404,
};

module.exports = {
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_ALREDY_EXISTS,
  ERROR_NOT_FOUND,
};
