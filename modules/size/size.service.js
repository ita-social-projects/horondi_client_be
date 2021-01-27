const Size = require('./size.model');
const { calculatePrice } = require('../currency/currency.utils');
const {
  SIZES_NOT_FOUND,
  SIZE_ALREADY_EXIST,
  SIZE_NOT_FOUND,
} = require('../../error-messages/size.messages');

class SizeService {
  async getAllSizes() {
    return Size.find();
  }
  async getSizeById(id) {
    const size = Size.findById(id);
    if (size) {
      return size;
    }
    throw new Error(SIZES_NOT_FOUND);
  }

  async addSize(sizeData) {
    const size = Size.find({ name: sizeData.name });
    if (size.length) {
      throw new Error(SIZE_ALREADY_EXIST);
    }
    sizeData.additionalPrice = await calculatePrice(sizeData.additionalPrice);
    return new Size(sizeData).save();
  }

  async deleteSize(id) {
    const foundSize = Size.findByIdAndDelete(id).lean();
    if (!foundSize) {
      throw new Error(SIZE_NOT_FOUND);
    }
    return foundSize;
  }

  async updateSize(id, input) {
    const sizeToUpdate = Size.findById(id).lean();
    if (!sizeToUpdate) {
      throw new Error(SIZE_NOT_FOUND);
    }
    input.additionalPrice = await calculatePrice(input.additionalPrice);
    return Size.findByIdAndUpdate(id, input);
  }
}

module.exports = new SizeService();
