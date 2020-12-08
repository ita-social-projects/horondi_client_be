const Sizes = require('./sizes.model');
const { SIZES_NOT_FOUND } = require('../../error-messages/sizes.messages');

class SizesService {
  async getAllSizes() {
    return await Sizes.find();
  }
  async getBusinessTextById(id) {
    const sizes = await Sizes.findById(id);
    if (sizes) {
      return sizes;
    }
    throw new Error(SIZES_NOT_FOUND);
  }
}

module.exports = new BusinessTextService();
