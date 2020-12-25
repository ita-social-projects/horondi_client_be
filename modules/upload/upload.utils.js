const uploadService = require('./upload.service');

const uploadLargeImage = async file => {
  let result = await uploadService.uploadFile(file, ['large']);
  return result.fileNames.large;
};

module.exports = {
  uploadLargeImage,
};
