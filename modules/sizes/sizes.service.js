const Sizes = require('./sizes.model');
const { SIZES_NOT_FOUND } = require('../../error-messages/sizes.messages');

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
}

module.exports = new SizesService();
