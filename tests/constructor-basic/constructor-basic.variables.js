const wrongId = '6009dcd5f9855555907ebf5e';
const newConstructorBasic = (materialID, colorID) => ({
  name: [
    { lang: 'ua', value: 'варіант 1' },
    { lang: 'en', value: 'variant 1' },
  ],
  material: materialID,
  color: colorID,
  available: true,
  default: false,
});
const getConstructorData = construrtorBasic => ({
  name: [
    {
      lang: construrtorBasic.name[0].lang,
      value: construrtorBasic.name[0].value,
    },
    {
      lang: construrtorBasic.name[1].lang,
      value: construrtorBasic.name[1].value,
    },
  ],
  material: { _id: construrtorBasic.material },
  color: { _id: construrtorBasic.color },
  available: construrtorBasic.available,
  default: construrtorBasic.default,
});
const getConstructorDataForUpt = construrtorBasic => ({
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
  material: construrtorBasic.material,
  color: construrtorBasic.color,
  available: true,
  default: false,
});

module.exports = {
  wrongId,
  newConstructorBasic,
  getConstructorData,
  getConstructorDataForUpt,
};
