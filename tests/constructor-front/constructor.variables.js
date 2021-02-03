const wrongId = '6009dcd5f9855555907ebf5e';
const newConstructorFront = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'Щось' },
    { lang: 'en', value: 'Something' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURL',
  basePrice: 0,
  available: true,
  default: false,
});
const newConstructorFrontUpdateInp = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'Щось 2' },
    { lang: 'en', value: 'Something 2' },
  ],
  material: materialID,
  color: colorID,
  image: '/imageURL2',
  basePrice: 0,
  available: true,
  default: false,
});
const getConstructorData = construrtorFront => ({
  name: [
    {
      lang: construrtorFront.name[0].lang,
      value: construrtorFront.name[0].value,
    },
    {
      lang: construrtorFront.name[1].lang,
      value: construrtorFront.name[1].value,
    },
  ],
  material: { _id: construrtorFront.material },
  color: { _id: construrtorFront.color },
  image: construrtorFront.image,
  available: construrtorFront.available,
  default: construrtorFront.default,
});
const getConstructorDataForUpt = ConstructorFrontPocket => ({
  name: [
    {
      lang: 'ua',
      value: 'ПІСЛЯ',
    },
    {
      lang: 'en',
      value: 'After',
    },
  ],
  material: ConstructorFrontPocket.material,
  color: ConstructorFrontPocket.color,
  image: '/new img',
  available: true,
  default: false,
});

module.exports = {
  getConstructorData,
  newConstructorFront,
  newConstructorFrontUpdateInp,
  getConstructorDataForUpt,
  wrongId,
};
