const Strap = require('./strap.model');
const {
  STRAP_NOT_FOUND,
  STRAP_ALREADY_EXIST,
  COLOR_NOT_PROVIDED,
} = require('../../error-messages/strap.messages');

class StrapService {
  async getAllStraps({ skip, limit }) {
    const items = await Strap.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Strap.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getStrapById(id) {
    const foundStrap = await Strap.findById(id).exec();
    if (foundStrap) {
      return foundStrap;
    }
    throw new Error(STRAP_NOT_FOUND);
  }

  async getStrapsByModel(id) {
    const strap = Strap.find({ model: id }).exec();
    if (strap.length === 0) {
      throw new Error(STRAP_NOT_FOUND);
    }
    return strap;
  }

  async deleteStrap({ id }) {
    const foundStrap = await Strap.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundStrap) {
      throw new Error(STRAP_NOT_FOUND);
    }

    const deletedImage = await uploadService.deleteFiles(
      Object.values(foundStrap.image)
    );

    if (await Promise.allSettled(deletedImage)) {
      return foundStrap;
    }
  }

  async updateStrap({ id, strap, image }) {
    const strapToUpdate = await Strap.findById(id).exec();
    if (!strapToUpdate) {
      throw new Error(STRAP_NOT_FOUND);
    }

    if (await this.checkIfStrapExist(strap, id)) {
      throw new Error(STRAP_ALREADY_EXIST);
    }

    if (!image) {
      return await Strap.findByIdAndUpdate(id, strap, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    image = uploadImage.fileNames.small;

    return await Strap.findByIdAndUpdate(id, { ...strap, image }).exec();
  }

  async addStrap({ strap, image }) {
    if (await this.checkIfStrapExist(strap)) {
      throw new Error(STRAP_ALREADY_EXIST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      image = uploadImage.fileNames.small;
    }
    return new Strap({ ...strap, image }).save();
  }

  async checkIfStrapExist(data, id) {
    let strapCount = await Strap.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return strapCount > 0;
  }
}

module.exports = new StrapService();
