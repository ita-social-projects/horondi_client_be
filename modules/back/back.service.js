const Back = require('./back.model');
const Model = require('../model/model.model');
const uploadService = require('../upload/upload.utils');
const {
  BACK_NOT_FOUND,
  BACK_ALREADY_EXIST,
  IMAGE_NOT_PROVIDED,
} = require('../../consts/back-messages');

class BackService {
  async getAllBacks({ skip, limit }) {
    const items = await Back.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Back.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getBackById(id) {
    const foundBack = await Back.findById(id).exec();
    if (foundBack) {
      return foundBack;
    }
    throw new Error(BACK_NOT_FOUND);
  }

  async getBacksByModel(id) {
    const back = Back.find({ model: id }).exec();
    if (back.length === 0) {
      throw new Error(BACK_NOT_FOUND);
    }
    return back;
  }

  async updateBack({ id, back, image }) {
    const backToUpdate = await Back.findById(id).exec();
    if (!backToUpdate) {
      throw new Error(BACK_NOT_FOUND);
    }

    if (await this.checkIfBackExist(back, id)) {
      throw new Error(BACK_ALREADY_EXIST);
    }

    if (!image) {
      return await Back.findByIdAndUpdate(id, back, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    image = uploadImage.fileNames.small;

    return await Back.findByIdAndUpdate(id, { ...back, image }).exec();
  }

  async deleteBack({ id }) {
    const foundBack = await Back.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundBack) {
      throw new Error(BACK_NOT_FOUND);
    }

    const deletedImage = await uploadService.deleteFiles(
      Object.values(foundBack.image)
    );

    if (await Promise.allSettled(deletedImage)) {
      return foundBack;
    }
  }

  async addBack({ back, image }) {
    if (await this.checkIfBackExist(back)) {
      throw new Error(BACK_ALREADY_EXIST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      image = uploadImage.fileNames.small;
    }

    return new Back({ ...back, image }).save();
  }

  async checkIfBackExist(data, id) {
    let backCount = await Back.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();

    return backCount > 0;
  }
}

module.exports = new BackService();
