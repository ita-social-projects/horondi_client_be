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
  material: [],
};
const imgString = 'small_id73jyckmc4ycke_основа-жовта.png';
const newImgString = 'small_test-file';
const newImgObj = {
  small: 'small_test-file',
  large: 'large_test-file',
  medium: 'medium_test-file',
  thumbnail: 'thumbnail_test-file',
};

const newStrap = (colorId, materialId) => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  features: {
    color: colorId,
    material: materialId,
  },
  image: 'empty',
  available: true,
  absolutePrice: 10,
});

const strapWithConvertedPrice = (
  colorId,
  materialId,
  imageStr,
  translationsKeyId
) => ({
  name: [
    { lang: 'uk', value: 'тест' },
    { lang: 'en', value: 'test' },
  ],
  optionType: 'STRAP',
  features: {
    material: { _id: materialId },
    color: { _id: colorId },
  },
  images: imageStr,
  available: true,
  absolutePrice: 10,
  translationsKey: translationsKeyId,
});

const strapToUpdate = (colorId, materialId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: colorId,
    material: materialId,
  },
  image: imgString,
  available: true,
  absolutePrice: 10,
});

const newStrapUpdated = (colorId, materialId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: { _id: colorId },
    material: { _id: materialId },
  },
  images: newImgObj,
  available: true,
  absolutePrice: 10,
});

const newStrapUpdatedWithImage = (colorId, materialId) => ({
  name: [
    { lang: 'uk', value: 'змінено' },
    { lang: 'en', value: 'updated' },
  ],
  optionType: 'STRAP',
  features: {
    color: { _id: colorId },
    material: { _id: materialId },
  },
  images: newImgObj,
  available: true,
  absolutePrice: 10,
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
