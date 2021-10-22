const wrongId = '5fb412d8663cf10bec9faa1a';
const wrongIdForError = 'id';
const wrongModelIdForError = 'modelId';
const wrongModelId = '60f4472533486a0f20bcd1af';
const skip = 0;
const limit = 2;
const filter = {
  name: '',
  available: [],
  color: [],
};
const imgString = 'small_id73jyckmc4ycke_основа-жовта.png';
const newImgString = 'small_test-file';
const newImgObj = {
  small: 'small_test-file',
  large: 'large_test-file',
  medium: 'medium_test-file',
  thumbnail: 'thumbnail_test-file',
};

const newStrap = colorId => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  features: {
    color: colorId,
  },
  image: 'empty',
  available: true,
  additionalPrice: {
    value: 40,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const strapWithConvertedPrice = (colorId, imageStr) => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  features: {
    color: { _id: colorId },
  },
  images: imageStr,
  available: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 270,
    },
    {
      currency: 'USD',
      value: 10,
    },
  ],
});

const strapToUpdate = (colorId, modelId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: colorId,
  },
  image: imgString,
  available: true,
  additionalPrice: {
    value: 40,
    type: 'ABSOLUTE_INDICATOR',
  },
});

const newStrapUpdated = (colorId, modelId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: { _id: colorId },
  },
  images: newImgObj,
  available: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 270,
    },
    {
      currency: 'USD',
      value: 10,
    },
  ],
});

const newStrapUpdatedWithImage = (colorId, modelId, imageStr) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: { _id: colorId },
  },
  images: newImgObj,
  available: true,
  additionalPrice: [
    {
      currency: 'UAH',
      value: 270,
    },
    {
      currency: 'USD',
      value: 10,
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
  newImgObj,
  newImgString,
};
