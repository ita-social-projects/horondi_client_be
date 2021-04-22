const newClosure = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'uk', value: ' тест' },
    { lang: 'en', value: ' test' },
  ],
  optionType: 'CLOSURE',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  available: true,
  default: true,
});

const closureWithConvertedPrice = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'uk', value: ' тест' },
    { lang: 'en', value: ' test' },
  ],
  optionType: 'CLOSURE',
  model: {
    _id: modelId,
  },
  features: {
    material: {
      _id: materialId,
    },
    color: {
      _id: colorId,
    },
  },
  available: true,
  default: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 0,
    },
    null,
  ],
});

const newClosureUpdated = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'uk', value: ' змінено' },
    { lang: 'en', value: ' updated' },
  ],
  optionType: 'CLOSURE',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  available: true,
  default: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 8000,
    },
    {
      currency: 'USD',
      value: 400,
    },
  ],
});
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newClosure,
  closureWithConvertedPrice,
  newClosureUpdated,
  wrongId,
};
