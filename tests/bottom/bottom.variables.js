const newBottomInputData = (materialId, colorId) => ({
  name: [
    { lang: 'ua', value: 'Низ тест' },
    { lang: 'en', value: 'Bottom test' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  absolutePrice: 5,
  available: true,
  optionType: 'BOTTOM',
});

const newBottomInputDataUpdate = (materialId, colorId) => ({
  name: [
    { lang: 'ua', value: 'Низ змінено' },
    { lang: 'en', value: 'Bottom changed' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  available: false,
  absolutePrice: 5,
  optionType: 'BOTTOM',
});

const wrongId = '5fb412d8663cf10bec9faa1a';

const filter = {
  name: '',
};

const skip = 0;
const limit = 5;

module.exports = {
  skip,
  limit,
  filter,
  newBottomInputData,
  newBottomInputDataUpdate,
  wrongId,
};
