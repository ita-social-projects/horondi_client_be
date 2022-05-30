const newConstructorBottom = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Деяке імя' },
    { lang: 'en', value: 'Some name' },
  ],
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  image: 'askjfsdgfaowifjsklfjlsfkjl',
  basePrice: 1,
  available: true,
  customizable: true,
});
const getConstructorData = (construrtor, { materialId, colorId, modelId }) => ({
  name: [
    {
      lang: construrtor.name[0].lang,
      value: construrtor.name[0].value,
    },
    {
      lang: construrtor.name[1].lang,
      value: construrtor.name[1].value,
    },
  ],
  optionType: 'CONSTRUCTOR_BOTTOM',
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
  image: construrtor.image,
  available: construrtor.available,
  customizable: construrtor.customizable,
  basePrice: 1,
});

const getConstructorDataForUpt = (materialId, colorId, modelId) => ({
  name: [
    { lang: 'ua', value: 'Деяке нове імя' },
    { lang: 'en', value: 'Some new name' },
  ],
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: modelId,
  features: {
    material: materialId,
    color: colorId,
  },
  image: 'sdvoaapvpsdasdafasd.jpg',
  available: true,
  customizable: true,
  basePrice: 1,
});

const filter = {
  name: '',
  model: [],
  material: [],
  color: [],
  available: [],
};

const skip = 0;
const limit = 5;

module.exports = {
  filter,
  skip,
  limit,
  newConstructorBottom,
  getConstructorData,
  getConstructorDataForUpt,
};
