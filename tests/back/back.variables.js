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
  available: true,
  customizable: false,
  optionType: 'BACK',
});

const newBackInputDataUpdate = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Спинка змінено' },
    { lang: 'en', value: 'Back changed' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  model: modelId,
  available: true,
  customizable: true,
  additionalPrice: 3,
  optionType: 'BACK',
});

const wrongId = '5fb412d8663cf10bec9faa1a';

const filter = {
  name: '',
  model: [],
  available: [],
  material: [],
  color: [],
};

const skip = 0;
const limit = 5;

module.exports = {
  skip,
  limit,
  filter,
  newBackInputData,
  newBackInputDataUpdate,
  wrongId,
};
