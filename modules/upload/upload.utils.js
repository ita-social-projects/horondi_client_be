const uploadService = require('./upload.service');

const uploadLargeImage = async file => {
  let result = await uploadService.uploadFile(file, ['large']);
  return result.fileNames.large;
};

const uploadSmallImage = async file => {
  let result = await uploadService.uploadFile(file, ['small']);
  return result.fileNames.small;
};

module.exports = {
  uploadLargeImage,
  uploadSmallImage,
};
