const wrongId = '6009dcd5f9855555907ebf5e';
const newConstructorBasic = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'варіант 1' },
    { lang: 'en', value: 'variant 1' },
  ],
  optionType: 'CONSTRUCTOR_BASIC',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  available: true,
  default: true,
  basePrice: 1,
});

const getConstructorData = (
  construrtorBasic,
  { materialId, colorId, modelId }
) => ({
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
  optionType: 'CONSTRUCTOR_BASIC',
  model: { _id: modelId },
  features: {
    material: {
      _id: materialId,
      available: true,
      name: [
        {
          lang: 'uk',
          value: 'Матеріал test',
        },
        {
          lang: 'en',
          value: 'Material test',
        },
      ],
      purpose: 'INNER',
    },
    color: {
      _id: colorId,
      colorHex: '#3r56tg',
    },
  },
  available: construrtorBasic.available,
  default: construrtorBasic.default,
  basePrice: [
    {
      currency: 'UAH',
      value: 0,
    },
    null,
  ],
});

const getConstructorDataForUpt = (materialId, colorId, modelId) => ({
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
  optionType: 'CONSTRUCTOR_BASIC',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  available: true,
  default: false,
  basePrice: 1,
});

module.exports = {
  wrongId,
  newConstructorBasic,
  getConstructorData,
  getConstructorDataForUpt,
};
