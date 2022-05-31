const newPocketInputData = () => ({
  name: [
    { lang: 'ua', value: 'ліва' },
    { lang: 'en', value: 'left' },
  ],
  optionType: 'POCKET',
  restriction: false,
  absolutePrice: 5,
  positions: ['60fff9f63affc3410c21ab54'],
});

const newPocketInputDataUpdate = () => ({
  name: [
    { lang: 'ua', value: 'ліва' },
    { lang: 'en', value: 'left' },
  ],
  optionType: 'POCKET',
  restriction: false,
  absolutePrice: 5,
  positions: ['60fff9f63affc3410c21ab54'],
});

const wrongId = '5fb412d8663cf10bec9faa1a';

const filter = {
  name: '',
  search: '',
};

const skip = 0;
const limit = 5;

module.exports = {
  skip,
  limit,
  filter,
  newPocketInputData,
  newPocketInputDataUpdate,
  wrongId,
};
