const Size = require('./size.model');
const { SIZES_NOT_FOUND } = require('../../error-messages/sizes.messages');

class SizeService {
  async getAllSizes() {
    return await Size.find();
  }
  async getSizeById(id) {
    const size = await Size.findById(id);
    if (size) {
      return size;
    }
    throw new Error(SIZES_NOT_FOUND);
  }
}

module.exports = new SizeService();
