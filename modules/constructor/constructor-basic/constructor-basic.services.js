const ConstructorBasic = require('./constructor-basic.model');
const uploadService = require('../../upload/upload.service');
const {
  BASIC_NOT_FOUND,
  BASIC_ALREADY_EXIST,
  IMAGE_NOT_PROVIDED,
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

  async addConstructorBasic(data, upload) {
    if (await this.checkConstructorBasicExist(data)) {
      throw new Error(BASIC_ALREADY_EXIST);
    }
    if (!upload) {
      throw new Error(IMAGE_NOT_PROVIDED);
    }
    const uploadResult = await uploadService.uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    data.image = imageResults.fileNames;
    data.basePrice = await calculatePrice(data.basePrice);
    return await new ConstructorBasic(data).save()
  }


  async updateConstructorBasic({ id, basic, upload }) {
    const constructorBasic = await ConstructorBasic.findById(id).populate(
      'material',
    );
    if (!constructorBasic) {
      throw new Error(BASIC_NOT_FOUND);
    }
    basic.basePrice = await calculatePrice(basic.basePrice);
    if (!upload) {
      return await ConstructorBasic.findByIdAndUpdate(id, basic,
        { new: true },
      );
    }
    if (constructorBasic.image) {
      await uploadService.deleteFiles([constructorBasic.image]);
    }
    const uploadResult = await uploadService.uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    basic.images = imageResults.fileNames;

    return await ConstructorBasic.findByIdAndUpdate(
      id, basic,
      { new: true},
    );
  }

  async deleteConstructorBasic(id) {
    const constructorBasic = await ConstructorBasic.findByIdAndDelete(id);
    if (!constructorBasic) {
      throw new Error(BASIC_NOT_FOUND);
    }
    if (constructorBasic.image) {
      await uploadService.deleteFiles([constructorBasic.image]);
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
