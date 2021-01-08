const ConstructorBottom = require('./constructor-bottom.model');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST
} = require('../../../error-messages/constructor-bottom.messages');
const {calculatePrice} = require('../../currency/currency.utils');

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
    const constructorBottom = await new ConstructorBottom(data).save();
    return await  ConstructorBottom.findById(constructorBottom._id).populate({
      path: 'material',
      model: 'Material',
      populate: {
        path: 'color',
        model: 'Color',
      },
    });
  }

  async updateConstructorBottom(id, constructorElement) {
    const constructorBottom = await ConstructorBottom.findById(id);
    if (!constructorBottom) {
      throw new Error(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    }

    constructorElement.basePrice = await calculatePrice(
      constructorElement.basePrice
    );
    return ConstructorBottom.findByIdAndUpdate(id, constructorElement, {
      new: true,
    }).populate({
      path: 'material',
      model: 'Material',
      populate: {
        path: 'color',
        model: 'Color',
      },
    });
  }

  async deleteConstructorBottom(id) {
    const constructorBottom = await ConstructorBottom.findByIdAndDelete(id);
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
