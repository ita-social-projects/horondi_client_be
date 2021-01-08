const ConstructorFrontPocket = require('./constructor-front-pocket.model');
const uploadService = require('../../upload/upload.service');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST
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
    const foundConstructorFrontPocket = await ConstructorFrontPocket.findById(id).populate({
      path: 'material',
      model: 'Material',
      populate: {
        path: 'color',
        model: 'Color',
      },
    });
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
    const constructorPocket = await new ConstructorFrontPocket(data).save();
    return await  ConstructorFrontPocket.findById(constructorPocket._id).populate({
      path: 'material',
      model: 'Material',
      populate: {
        path: 'color',
        model: 'Color',
      },
    });
  }

  async updateConstructorFrontPocket({ id, constructorElement }) {
    const constructorFrontPocket = await ConstructorFrontPocket.findById(id)
    if (!constructorFrontPocket) {
      throw new Error(FRONT_POCKET_NOT_FOUND);
    }
    constructorElement.basePrice = await calculatePrice(constructorElement.basePrice);
    return await ConstructorFrontPocket.findByIdAndUpdate(
      id, constructorElement,
      { new: true},
    ).populate({
      path: 'material',
      model: 'Material',
      populate: {
        path: 'color',
        model: 'Color',
      },
    });
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
