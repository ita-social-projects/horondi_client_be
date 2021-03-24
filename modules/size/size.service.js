const Size = require('./size.model');
const { calculatePrice } = require('../currency/currency.utils');
const {
  SIZES_NOT_FOUND,
  SIZE_NOT_FOUND,
} = require('../../error-messages/size.messages');

class SizeService {
  async getAllSizes() {
    return await Size.find().exec();
  }
  async getSizeById(id) {
    const size = await Size.findById(id).exec();

    if (size) {
      return size;
    }
    throw new Error(SIZES_NOT_FOUND);
  }

  async addSize(sizeData) {
    sizeData.additionalPrice = await calculatePrice(sizeData.additionalPrice);
    return new Size(sizeData).save();
  }

  async deleteSize(id) {
    const foundSize = await Size.findByIdAndDelete(id)
      .lean()
      .exec();
    if (!foundSize) {
      throw new Error(SIZE_NOT_FOUND);
    }
    return foundSize;
  }

  async updateSize(id, input) {
    const sizeToUpdate = await Size.findById(id)
      .lean()
      .exec();
    if (!sizeToUpdate) {
      throw new Error(SIZE_NOT_FOUND);
    }
    input.additionalPrice = await calculatePrice(input.additionalPrice);
    return await Size.findByIdAndUpdate(id, input).exec();
  }
}

module.exports = new SizeService();
