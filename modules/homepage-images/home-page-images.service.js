const LooksImages = require('./home-page-images.model');

const uploadService = require('../upload/upload.service');

const {
  IMAGES_WERE_NOT_CONVERTED,
  IMAGE_NOT_FOUND,
} = require('../../error-messages/home-page-messages');

class HomePageImagesService {
  async getHomePageLooksImages() {
    const looksImages = LooksImages.find();

    if (!looksImages) throw new Error(IMAGE_NOT_FOUND);

    return looksImages;
  }

  async addHomePageLooksImage(data) {
    const resizedImage = await this.uploadImages([data.images]);

    if (!resizedImage) throw new Error(IMAGES_WERE_NOT_CONVERTED);

    return await new LooksImages({ images: resizedImage[0] }).save();
  }

  async deleteHomePageLooksImage(data) {
    const looksImage = LooksImages.findById(data.id).lean();

    if (!looksImage) throw new Error(IMAGE_NOT_FOUND);

    if (looksImage && looksImage.images) {
      this.deleteImages(looksImage.images);
    }

    return LooksImages.findByIdAndDelete(id);
  }

  async updateHomePageLooksImage(data) {
    const imagesToUpdate = LooksImages.findById(data.id).lean();
    if (!imagesToUpdate) throw new Error(IMAGE_NOT_FOUND);

    return (
      data.images &&
      this.deleteImages(imagesToUpdate.images) &&
      this.saveUpdatedLooksImages(data.id, data.images)
    );
  }

  async uploadImages(data) {
    const uploadResult = await uploadService.uploadFiles(data);
    const imagesResult = await Promise.allSettled(uploadResult);
    const resizedImages = imagesResult.map(item => item.value.fileNames);

    if (!resizedImages) throw new Error(IMAGES_WERE_NOT_CONVERTED);

    return resizedImages;
  }

  async saveUpdatedLooksImages(id, imageToUpload) {
    const images = await this.uploadImages([imageToUpload]);

    return LooksImages.findByIdAndUpdate(
      id,
      { images: images[0] },
      {
        new: true,
      }
    );
  }

  async deleteImages(imagesToDelete) {
    const deletedImages = await uploadService.deleteFiles([imagesToDelete]);

    if (!deletedImages) throw new Error(IMAGES_WERE_NOT_CONVERTED);

    return await Promise.allSettled(deletedImages);
  }
}

module.exports = new HomePageImagesService();
