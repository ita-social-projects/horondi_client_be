const wrongId = '6009dcd5f9855555907ebf5e';

const filter = {
  name: '',
  model: [],
  material: [],
  color: [],
  pattern: [],
  available: [],
};

const skip = 0;
const limit = 5;

const newConstructorFront = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Щось' },
    { lang: 'en', value: 'Something' },
  ],
  optionType: 'CONSTRUCTOR_FRONT_POCKET',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  image: '/imageURL',
  basePrice: 0,
  available: true,
  customizable: false,
});
const newConstructorFrontUpdateInp = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Щось 2' },
    { lang: 'en', value: 'Something 2' },
  ],
  optionType: 'CONSTRUCTOR_FRONT_POCKET',
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
  image: '/imageURL2',
  basePrice: [
    {
      currency: 'UAH',
      value: 2700,
    },
    {
      currency: 'USD',
      value: 100,
    },
  ],
  available: true,
  customizable: false,
});

const getConstructorData = (
  construrtorFront,
  { materialId, colorId, modelId },
) => ({
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
  optionType: 'CONSTRUCTOR_FRONT_POCKET',
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
  image: construrtorFront.image,
  available: construrtorFront.available,
  customizable: construrtorFront.customizable,
  basePrice: [
    {
      currency: 'UAH',
      value: 2700,
    },
    {
      currency: 'USD',
      value: 100,
    },
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
  optionType: 'CONSTRUCTOR_FRONT_POCKET',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  image: '/new img',
  available: true,
  customizable: false,
  basePrice: 1,
});

module.exports = {
  getConstructorData,
  newConstructorFront,
  newConstructorFrontUpdateInp,
  getConstructorDataForUpt,
  wrongId,
  filter,
  skip,
  limit,
};
