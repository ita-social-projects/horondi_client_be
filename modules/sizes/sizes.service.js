const Sizes = require('./sizes.model');
const {
  SIZES_NOT_FOUND,
  SIZE_ALREADY_EXIST,
  SIZE_NOT_FOUND,
} = require('../../error-messages/sizes.messages');

class SizesService {
  async getAllSizes() {
    return await Sizes.find();
  }
  async getSizeById(id) {
    const size = await Sizes.findById(id);
    if (size) {
      return size;
    }
    throw new Error(SIZES_NOT_FOUND);
  }

  async addSize(sizeData) {
    const size = await Sizes.find({ name: sizeData.name });
    if (size.length) {
      throw new Error(SIZE_ALREADY_EXIST);
    }
    return new Sizes(sizeData).save();
  }

  async deleteSize(id) {
    const foundSize = await Sizes.findByIdAndDelete(id).lean();
    if (!foundSize) {
      throw new Error(SIZE_NOT_FOUND);
    }
    return foundSize;
  }

  async updateSize(id, input) {
    const sizeToUpdate = await Sizes.findById(id).lean();
    if (!sizeToUpdate) {
      throw new Error(SIZE_NOT_FOUND);
    }
    return await Sizes.findByIdAndUpdate(id, input);
  }
}

module.exports = new SizesService();
