const ConstructorBottom = require('./constructor-bottom.model');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST
} = require('../../../error-messages/constructor-bottom.messages');
const {calculatePrice} = require('../../../utils/calculate-price');

class ConstructorBottomService {
  async getConstructorBottomById(id) {
    const constructorBottom = ConstructorBottom.findById(id).populate(
      'material'
    );
    if (!constructorBottom) {
      throw new Error(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    }
    return constructorBottom;
  }

  async getAllConstructorBottom() {
    return await ConstructorBottom.find().populate('material');
  }

  async addConstructorBottom(data) {
    if (await this.checkConstructorBottomExist(data)) {
      throw new Error(CONSTRUCTOR_BOTTOM_ALREADY_EXIST);
    }
    data.basePrice = await calculatePrice(data.basePrice);
    return await new ConstructorBottom(data).save();
  }

  async updateConstructorBottom(id, newConstructorBottom) {
    const constructorBottom = await ConstructorBottom.findById(id).populate(
      'material'
    );
    if (!constructorBottom) {
      throw new Error(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    }

    newConstructorBottom.basePrice = await calculatePrice(
      newConstructorBottom.basePrice
    );
    return ConstructorBottom.findByIdAndUpdate(id, newConstructorBottom, {
      new: true,
    });
  }

  async deleteConstructorBottom(id) {
    const constructorBottom = await ConstructorBottom.findByIdAndDelete(
      id
    ).populate('material');

    if (!constructorBottom) {
      throw new Error(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    }

    return constructorBottom;
  }

  async checkConstructorBottomExist(data) {
    let constructorBottomCount = await ConstructorBottom.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorBottomCount > 0;
  }
}

module.exports = new ConstructorBottomService();
