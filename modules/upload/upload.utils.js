const uploadService = require('./upload.service');
const {
  IMAGE_SIZES: { IMAGE_LARGE, IMAGE_SMALL },
} = require('../../consts/image-sizes');

const uploadLargeImage = async file => {
  const result = await uploadService.uploadFile(file, [IMAGE_LARGE]);

  return result.fileNames.large;
};

const uploadSmallImage = async file => {
  const result = await uploadService.uploadFile(file, [IMAGE_SMALL]);

  return result.fileNames.small;
};

module.exports = {
  uploadLargeImage,
  uploadSmallImage,
};
