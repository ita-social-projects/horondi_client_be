const HomePageImages = require('./home-page-images.model');
const {
  IMAGES_WERE_NOT_CONVERTED,
} = require('../../error-messages/home-page-messages');
class HomePageImagesService {
  async addImage({ images }) {
    const uploadResult = await uploadFiles(images);

    const imageResults = await Promise.allSettled(uploadResult);

    const resizedImages = imageResults.map(item => item.value.fileNames);

    if (!resizedImages) {
      throw new Error(IMAGES_WERE_NOT_CONVERTED);
    }

    return new HomePageImages(resizedImages).save();
  }
}
module.exports = new HomePageImagesService();
