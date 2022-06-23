const wrongId = '5f311ec5f2983e390432a8c3';
const wrongSkip = -1;
const wrongLimit = -5;
const testValue = 'test value';
const updateValue = 'update value';
const filter = {
  name: '',
  model: [],
  available: [],
  material: [],
  handmade: [],
};

const pagination = {
  skip: 0,
  limit: 5,
};
const wrongPagination = {
  skip: -1,
  limit: 5,
};

const finalPrice = 10;

const mutationPatternToAdd = (materialId, modelId) => ({
  name: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  optionType: 'PATTERN',
  model: modelId,
  features: {
    material: materialId,
    handmade: false,
  },
  absolutePrice: 10,
  relativePrice: null,
  available: true,
  customizable: true,
});

const queryPatternToAdd = (materialId, modelId) => ({
  name: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  optionType: 'PATTERN',
  model: modelId,
  features: {
    material: materialId,
    handmade: false,
  },
  absolutePrice: 1,
  relativePrice: null,
  available: true,
  customizable: false,
});

const createdPattern = (materialId, modelId) => ({
  name: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: testValue,
    },
    {
      lang: 'en',
      value: testValue,
    },
  ],
  optionType: 'PATTERN',
  model: { _id: modelId },
  features: {
    material: { _id: materialId },
    handmade: false,
  },
  absolutePrice: finalPrice,
  relativePrice: null,
  available: true,
  customizable: true,
});

const patternToUpdate = (materialId, modelId) => ({
  name: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
    },
  ],
  optionType: 'PATTERN',
  model: modelId,
  features: {
    material: materialId,
    handmade: false,
  },
  absolutePrice: 10,
  relativePrice: null,
  available: true,
  customizable: false,
});

const patternAfterUpdate = (materialId, modelId) => ({
  name: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
    },
  ],
  description: [
    {
      lang: 'uk',
      value: updateValue,
    },
    {
      lang: 'en',
      value: updateValue,
    },
  ],
  optionType: 'PATTERN',
  model: { _id: modelId },
  features: {
    material: { _id: materialId },
    handmade: false,
  },
  absolutePrice: finalPrice,
  relativePrice: null,
  available: true,
  customizable: false,
});

module.exports = {
  patternToUpdate,
  wrongId,
  filter,
  pagination,
  wrongPagination,
  wrongSkip,
  wrongLimit,
  finalPrice,
  queryPatternToAdd,
  mutationPatternToAdd,
  createdPattern,
  patternAfterUpdate,
};
