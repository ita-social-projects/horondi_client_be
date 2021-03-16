const Pocket = require('./pockets.model');
const uploadService = require('../upload/upload.utils');
const {
  POCKET_ALREADY_EXIST,
  POCKET_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/pocket.messages');

class PocketService {
  async addPocket(pocketData, imageFile) {
    if (await this.checkIfPocketExist(pocketData)) {
      throw new Error(POCKET_ALREADY_EXIST);
    }

    if (imageFile) {
      const uploadImage = await uploadService.uploadLargeImage(imageFile);
      pocketData.image = uploadImage.fileNames.large;
    }

    return new Pocket(pocketData).save();
  }

  async checkIfPocketExist(data) {
    let pocketCount = await Pocket.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return pocketCount > 0;
  }
}

module.exports = new PocketService();
