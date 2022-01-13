const uploadService = require('../upload/upload.service');
const {
  MAP_IMAGES_INDECIES: { ZERO_INDEX, FIRST_INDEX },
} = require('../../consts/map-images-indecies');

const uploadContactImages = async data => {
  const uploadResult = await uploadService.uploadFiles([
    data.mapImages[ZERO_INDEX].image,
    data.mapImages[FIRST_INDEX].image,
  ]);
  const imagesResult = await Promise.allSettled(uploadResult);
  const images = imagesResult.map(item => item.value.fileNames);
  return [
    { lang: data.mapImages[ZERO_INDEX].lang, value: images[ZERO_INDEX] },
    { lang: data.mapImages[FIRST_INDEX].lang, value: images[FIRST_INDEX] },
  ];
};

module.exports = {
  uploadContactImages,
};
