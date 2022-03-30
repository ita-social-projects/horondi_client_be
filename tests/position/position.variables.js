const wrongId = '5fb412d8663cf10bec9faa1a';

const newPositionInputData = () => ({
  name: [
    { lang: 'ua', value: 'Позиція тест' },
    { lang: 'en', value: 'Position test' },
  ],
  available: true,
});

const positionUpdateData = () => ({
  name: [
    { lang: 'ua', value: 'Позиція обновлено тест' },
    { lang: 'en', value: 'Position update test' },
  ],
  available: false,
});

const filter = {
  search: '',
};

const skip = 0;
const limit = 5;

module.exports = {
  skip,
  limit,
  filter,
  newPositionInputData,
  positionUpdateData,
  wrongId,
};
