const LooksImages = require('./home-page-images.model');

const { uploadFiles, deleteFiles } = require('../upload/upload.service');

const {
  IMAGES_WERE_NOT_CONVERTED,
  IMAGE_NOT_FOUND,
} = require('../../error-messages/home-page-messages');

class HomePageImagesService {
  async getHomePageLooksImages() {
    const looksImages = await LooksImages.find();

    if (!looksImages) throw new Error(IMAGE_NOT_FOUND);

    return looksImages;
  }

  async addHomePageLooksImage(data) {
    const ResizedImage = await this.uploadImages([data.images]);

    return new LooksImages({ images: ResizedImage[0] }).save();
  }

  async deleteHomePageLooksImage(data) {
    const looksImage = await LooksImages.findById(data.id).lean();

    if (!looksImage) throw new Error(IMAGE_NOT_FOUND);

    if (looksImage && looksImage.images) {
      this.deleteImages(looksImage.images);
    }

    return await LooksImages.findByIdAndDelete(id);
  }

  async updateHomePageLooksImage(data) {
    const imagesToUpdate = await LooksImages.findById(data.id).lean();
    if (!imagesToUpdate) throw new Error(IMAGE_NOT_FOUND);

    return (
      data.images &&
      this.deleteImages(imagesToUpdate.images) &&
      this.saveUpdatedLooksImages(data.id, data.images)
    );
  }

  async uploadImages(data) {
    const uploadResult = await uploadFiles(data);
    const imagesResult = await Promise.allSettled(uploadResult);
    const resizedImages = imagesResult.map(item => item.value.fileNames);

    if (!resizedImages) throw new Error(IMAGES_WERE_NOT_CONVERTED);

    return resizedImages;
  }

  async saveUpdatedLooksImages(id, imageToUpload) {
    const images = await this.uploadImages([imageToUpload]);

    return await LooksImages.findByIdAndUpdate(
      id,
      { images: images[0] },
      {
        new: true,
      }
    );
  }

  async deleteImages(imagesToDelete) {
    const deletedImages = await deleteFiles([imagesToDelete]);

    return await Promise.allSettled(deletedImages);
  }
}

module.exports = new HomePageImagesService();
