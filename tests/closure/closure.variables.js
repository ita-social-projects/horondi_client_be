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
  customizable: true,
  additionalPrice: {
    value: 0,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const closureWithConvertedPrice = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'uk', value: ' тест' },
    { lang: 'en', value: ' test' },
  ],
  optionType: 'CLOSURE',
  model: { _id: modelId },
  features: {
    material: { _id: materialId },
    color: { _id: colorId },
  },
  available: true,
  customizable: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 270,
    },
    {
      currency: 'USD',
      value: 10,
    },
  ],
});

const closureToUpdate = (materialId, colorId, modelId) => ({
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
  customizable: true,
  additionalPrice: {
    value: 40,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const newClosureUpdated = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'uk', value: ' змінено' },
    { lang: 'en', value: ' updated' },
  ],
  optionType: 'CLOSURE',
  model: { _id: modelId },
  features: {
    material: { _id: materialId },
    color: { _id: colorId },
  },
  available: true,
  customizable: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 270,
    },
    {
      currency: 'USD',
      value: 10,
    },
  ],
});
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newClosure,
  closureWithConvertedPrice,
  newClosureUpdated,
  closureToUpdate,
  wrongId,
};
