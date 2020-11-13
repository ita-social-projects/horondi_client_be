const { uploadFiles } = require('../upload/upload.service');

const uploadContactImages = async data => {
  const uploadResult = await uploadFiles([
    data.mapImages[0].image,
    data.mapImages[1].image,
  ]);
  const imagesResult = await Promise.allSettled(uploadResult);
  const images = imagesResult.map(item => item.value.fileNames);
  return [
    { lang: data.mapImages[0].lang, value: images[0] },
    { lang: data.mapImages[1].lang, value: images[1] },
  ];
};

module.exports = {
  uploadContactImages,
};
