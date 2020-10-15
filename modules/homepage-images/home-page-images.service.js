const HomePageImages = require('./home-page-images.model');
const {
  IMAGES_WERE_NOT_CONVERTED,
} = require('../../error-messages/home-page-messages');
class HomePageImagesService {
  async getHomePageLooksImages() {
    let x = await HomePageImages.find();
    console.log(x);
    return x;
  }

  async addImage({ image }) {
    const uploadResult = await uploadFiles([image]);

    const imageResults = await uploadResult[0];

    const resizedImages = imageResults.fileNames;

    if (!resizedImages) {
      throw new Error(IMAGES_WERE_NOT_CONVERTED);
    }
    return new HomePageImages(resizedImages).save();
  }

  async updateHomePageLooksImage() {}
}
module.exports = new HomePageImagesService();
