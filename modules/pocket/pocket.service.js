const Pocket = require('./pocket.model');
const uploadService = require('../upload/upload.utils');
const {
  POCKET_ALREADY_EXIST,
  POCKET_NOT_FOUND,
} = require('../../error-messages/pocket.messages');

class PocketService {
  async getAllPockets({ skip, limit }) {
    const items = await Pocket.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Pocket.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getPocketById(id) {
    const foundPocket = await Pocket.findById(id).exec();
    if (foundPocket) {
      return foundPocket;
    }
    throw new Error(POCKET_NOT_FOUND);
  }

  async getPocketsByModel(id) {
    const pocket = Pocket.find({ model: id }).exec();
    if (pocket.length === 0) {
      throw new Error(POCKET_NOT_FOUND);
    }
    return pocket;
  }

  async deletePocket({ id }) {
    const foundPocket = await Pocket.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundPocket) {
      throw new Error(POCKET_NOT_FOUND);
    }

    const deletedImage = await uploadService.deleteFiles(
      Object.values(foundPocket.image)
    );

    if (await Promise.allSettled(deletedImage)) {
      return foundPocket;
    }
  }

  async updatePocket({ id, pocket, image }) {
    const pocketToUpdate = await Pocket.findById(id).exec();
    if (!pocketToUpdate) {
      throw new Error(POCKET_NOT_FOUND);
    }

    if (await this.checkIfPocketExist(pocket, id)) {
      throw new Error(POCKET_ALREADY_EXIST);
    }

    if (!image) {
      return await Pocket.findByIdAndUpdate(id, pocket, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    image = uploadImage.fileNames.small;

    return await Pocket.findByIdAndUpdate(id, { ...pocket, image }).exec();
  }

  async addPocket({ pocket, image }) {
    if (await this.checkIfPocketExist(pocket)) {
      throw new Error(POCKET_ALREADY_EXIST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      image = uploadImage.fileNames.small;
    }
    return new Pocket({ ...pocket, image }).save();
  }

  async checkIfPocketExist(data, id) {
    let pocketCount = await Pocket.countDocuments({
      _id: { $ne: id },
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
