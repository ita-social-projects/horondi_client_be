const uploadService = require('../upload/upload.service');

const uploadProductImages = async filesToUpload => {
  const uploadResult = await uploadService.uploadFiles(filesToUpload);
  const imagesResults = await Promise.allSettled(uploadResult);
  const primary = imagesResults[0].value.fileNames;
  const additional = imagesResults.slice(1).map(res => res.value.fileNames);
  return {
    primary,
    additional,
  };
};

const findAndDeleteImages = async product => {
  const { images } = product;
  const { primary, additional } = images;
  const additionalImagesToDelete =
    typeof additional[0] === 'object'
      ? additional.map(img => [...Object.values(img)]).flat()
      : [];

  return uploadService.deleteFiles([
    ...Object.values(primary),
    ...additionalImagesToDelete,
  ]);
};

module.exports = { uploadProductImages, findAndDeleteImages };
