const newBackInputData = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Бек тест' },
    { lang: 'en', value: 'Back test' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  model: modelId,
  images: {
    small: 'small_new',
    thumbnail: 'thumbnail_new',
    large: 'large_new',
    medium: 'medium_new',
  },
  available: true,
  customizable: true,
  additionalPrice: 1,
  optionType: 'BACK',
});
const newBackInputDataUpdate = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Бек змінено' },
    { lang: 'en', value: 'Back changed' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  model: modelId,
  image: '/imageURL',
  available: true,
  additionalPrice: 1,
});
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newBackInputData,
  newBackInputDataUpdate,
  wrongId,
};
