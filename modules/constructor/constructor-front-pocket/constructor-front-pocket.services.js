const ConstructorFrontPocket = require('./constructor-front-pocket.model');
const uploadService = require('../../upload/upload.service');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
  IMAGE_NOT_PROVIDED,
} = require('../../../error-messages/constructor-front-pocket-messages');
const {calculatePrice} = require('../../currency/currency.utils');

class ConstructorFrontPocketService {
  async getAllConstructorFrontPocket({ skip, limit }) {
    const items = await ConstructorFrontPocket.find().populate(
      'material',
    )
      .skip(skip)
      .limit(limit);

    const count = await ConstructorFrontPocket.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getConstructorFrontPocketById(id) {
    const foundConstructorFrontPocket = await ConstructorFrontPocket.findById(id).populate(
      'material',
    );
    if (foundConstructorFrontPocket) {
      return foundConstructorFrontPocket;
    }
    throw new Error(FRONT_POCKET_NOT_FOUND);
  }

  async addConstructorFrontPocket(data) {
    if (await this.checkConstructorFrontPocketExist(data)) {
      throw new Error(FRONT_POCKET_ALREADY_EXIST);
    }
    data.basePrice = await calculatePrice(data.basePrice);
    return await new ConstructorFrontPocket(data).save();
  }

  async updateConstructorFrontPocket({ id, pocket }) {
    const constructorFrontPocket = await ConstructorFrontPocket.findById(id).populate(
      'material',
    );
    if (!constructorFrontPocket) {
      throw new Error(FRONT_POCKET_NOT_FOUND);
    }
    pocket.basePrice = await calculatePrice(pocket.basePrice);
    return await ConstructorFrontPocket.findByIdAndUpdate(
      id, pocket,
      { new: true},
    );
  }

  async deleteConstructorFrontPocket(id) {
    const foundConstructorFrontPocket = await ConstructorFrontPocket.findByIdAndDelete(id).lean();
    if (!foundConstructorFrontPocket) {
      throw new Error(FRONT_POCKET_NOT_FOUND);
    }
    return foundConstructorFrontPocket;
  }

  async checkConstructorFrontPocketExist(data) {
    let constructorFrontPocketCount = await ConstructorFrontPocket.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorFrontPocketCount > 0;
  }
}

module.exports = new ConstructorFrontPocketService();
