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
  absolutePrice: 0,
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
  absolutePrice: 0,
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
  absolutePrice: 40,
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
  absolutePrice: 40,
});
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newClosure,
  closureWithConvertedPrice,
  newClosureUpdated,
  closureToUpdate,
  wrongId,
};
