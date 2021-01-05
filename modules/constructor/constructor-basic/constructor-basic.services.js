const ConstructorBasic = require('./constructor-basic.model');
const {
  BASIC_NOT_FOUND,
  BASIC_ALREADY_EXIST
} = require('../../../error-messages/constructor-basic-messages');
const {calculatePrice} = require('../../../utils/calculate-price');

class ConstructorBasicService {
  async getAllConstructorBasics({ skip, limit }) {
    const items = await ConstructorBasic.find().populate(
      'material',
    )
      .skip(skip)
      .limit(limit);

    const count = await ConstructorBasic.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getConstructorBasicById(id) {
    const foundBasic = await ConstructorBasic.findById(id).populate(
      'material',
    );
    if (foundBasic) {
      return foundBasic;
    }
    throw new Error(BASIC_NOT_FOUND);
  }

  async addConstructorBasic(data) {
    if (await this.checkConstructorBasicExist(data)) {
      throw new Error(BASIC_ALREADY_EXIST);
    }
    data.basePrice = await calculatePrice(data.basePrice);
    return  await new ConstructorBasic(data).save()
  }


  async updateConstructorBasic({ id, constructorElement }) {
    const constructorBasic = await ConstructorBasic.findById(id).populate(
      'material',
    );
    if (!constructorBasic) {
      throw new Error(BASIC_NOT_FOUND);
    }
    basic.basePrice = await calculatePrice(constructorElement.basePrice);
    return await ConstructorBasic.findByIdAndUpdate(
      id, constructorElement,
      { new: true},
    );
  }

  async deleteConstructorBasic(id) {
    const constructorBasic = await ConstructorBasic.findByIdAndDelete(id);
    if (!constructorBasic) {
      throw new Error(BASIC_NOT_FOUND);
    }
    return constructorBasic;
  }

  async checkConstructorBasicExist(data) {
    let constructorBasicCount = await ConstructorBasic.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorBasicCount > 0;
  }
}

module.exports = new ConstructorBasicService();
