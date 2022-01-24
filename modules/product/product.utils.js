const uploadService = require('../upload/upload.service');

const uploadProductImages = async (filesToUpload) => {
  const uploadResult = await uploadService.uploadFiles(filesToUpload);
  const imagesResults = await Promise.allSettled(uploadResult);
  const primary = imagesResults[0].value.fileNames;
  const additional = imagesResults.slice(1).map((res) => res.value.fileNames);

  return {
    primary,
    additional,
  };
};

module.exports = { uploadProductImages };
