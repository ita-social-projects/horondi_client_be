const newClosure = materialId => ({
  name: [
    { lang: 'uk', value: ' тест' },
    { lang: 'en', value: ' test' },
  ],
  material: materialId,
  available: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 7000,
    },
    {
      currency: 'USD',
      value: 240,
    },
  ],
});
const newClosureUpdated = materialId => ({
  name: [
    { lang: 'uk', value: ' змінено' },
    { lang: 'en', value: ' updated' },
  ],
  material: materialId,
  available: true,
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
  newClosureUpdated,
  wrongId,
};
