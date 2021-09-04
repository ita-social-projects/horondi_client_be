const wrongId = '5fb412d8663cf10bec9faa1a';
const wrongIdForError = 'id';
const wrongModelIdForError = 'modelId';
const wrongModelId = '60f4472533486a0f20bcd1af';
const skip = 0;
const limit = 2;
const filter = {
  name: '',
  model: [],
  available: [],
  color: [],
};
const imgString = 'small_id73jyckmc4ycke_основа-жовта.png';
const newImgString = 'small_test-file';

const newStrap = (colorId, modelId) => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  model: modelId,
  features: {
    color: colorId,
  },
  image: 'empty',
  available: true,
  customizable: true,
  additionalPrice: {
    value: 50,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const strapWithConvertedPrice = (colorId, modelId, imageStr) => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  model: { _id: modelId },
  features: {
    color: { _id: colorId },
  },
  image: imageStr,
  available: true,
  customizable: true,
  additionalPrice: [
    {
      value: 270,
      type: 'ABSOLUTE_INDICATOR',
    },
    {
      value: 10,
      type: 'ABSOLUTE_INDICATOR',
    },
  ],
});

const strapToUpdate = (colorId, modelId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  model: modelId,
  features: {
    color: colorId,
  },
  image: imgString,
  available: true,
  customizable: true,
  additionalPrice: {
    value: 70,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const newStrapUpdated = (colorId, modelId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  model: { _id: modelId },
  features: {
    color: { _id: colorId },
  },
  image: imgString,
  available: true,
  customizable: true,
  additionalPrice: [
    {
      value: 270,
      type: 'ABSOLUTE_INDICATOR',
    },
    {
      value: 10,
      type: 'ABSOLUTE_INDICATOR',
    },
  ],
});

const newStrapUpdatedWithImage = (colorId, modelId, imageStr) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  model: { _id: modelId },
  features: {
    color: { _id: colorId },
  },
  image: imageStr,
  available: true,
  customizable: true,
  additionalPrice: [
    {
      value: 270,
      type: 'ABSOLUTE_INDICATOR',
    },
    {
      value: 10,
      type: 'ABSOLUTE_INDICATOR',
    },
  ],
});

module.exports = {
  newStrap,
  strapWithConvertedPrice,
  strapToUpdate,
  newStrapUpdated,
  newStrapUpdatedWithImage,
  wrongModelIdForError,
  wrongIdForError,
  wrongId,
  wrongModelId,
  limit,
  skip,
  filter,
  imgString,
  newImgString,
};
