const newBackInputData = (materialId, colorId) => ({
  name: [
    { lang: 'ua', value: 'Бек тест' },
    { lang: 'en', value: 'Back test' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  images: {
    large: 'large_4051mu10kqv2xdlz_91.png',
    medium: 'medium_4051mu10kqv2xdlz_91.png',
    small: 'small_4051mu10kqv2xdlz_91.png',
    thumbnail: 'thumbnail_4051mu10kqv2xdlz_91.png',
  },
  available: true,
  additionalPrice: 1,
});
const newBackInputDataUpdate = (materialId, colorId) => ({
  name: [
    { lang: 'ua', value: 'Бек змінено' },
    { lang: 'en', value: 'Back changed' },
  ],
  features: {
    material: materialId,
    color: colorId,
  },
  images: {
    large: 'large_4051mu10kqv2xdlz_91.png',
    medium: 'medium_4051mu10kqv2xdlz_91.png',
    small: 'small_4051mu10kqv2xdlz_91.png',
    thumbnail: 'thumbnail_4051mu10kqv2xdlz_91.png',
  },
  available: true,
  additionalPrice: 1,
});
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newBackInputData,
  newBackInputDataUpdate,
  wrongId,
};
