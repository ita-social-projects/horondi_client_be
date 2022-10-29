const Size = require('./size.model');

class SizeService {
  async getSizeById(sizeId) {
    const size = await Size.findById(sizeId).exec();

    return size;
  }
}

module.exports = new SizeService();
