const ConstructorBasic = require('./constructor-basic.model');
const { deleteFiles, uploadFiles } = require('../../upload/upload.service');
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
    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    data.images = imageResults.fileNames;
    data.basePrice = await calculatePrice(data.basePrice);
    return await new ConstructorBasic(data).save()
  }


  async updateConstructorBasic({ id, basic, upload }) {
    const basicToUpdate = await ConstructorBasic.findById(id).populate(
      'material',
    );
    if (!basicToUpdate) {
      throw new Error(BASIC_NOT_FOUND);
    }
    basic.basePrice = await calculatePrice(basic.basePrice);
    if (!upload) {
      return await ConstructorBasic.findByIdAndUpdate(id, basic,
        { new: true },
      );
    }
    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    const images = imageResults.fileNames;
    const foundBasic = await ConstructorBasic.findById(id).lean();
    deleteFiles(Object.values(foundBasic.images));
    basic.images = images
    return await ConstructorBasic.findByIdAndUpdate(
      id, basic,
      { new: true},
    );
  }

  async deleteConstructorBasic(id) {
    const foundBasic = await ConstructorBasic.findByIdAndDelete(id).lean();
    if (!foundBasic) {
      throw new Error(BASIC_NOT_FOUND);
    }
    const deletedImages = await deleteFiles(Object.values(foundBasic.images));
    if (await Promise.allSettled(deletedImages)) {
      return foundBasic;
    }
  }

  async checkConstructorBasicExist(data, id) {
    let constructorBasicCount;
    if (id) {
      constructorBasicCount = await ConstructorBasic.countDocuments({
        _id: { $ne: id },
        name: {
          $elemMatch: {
            $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
          },
        },
      });
      return constructorBasicCount > 0;
    }
    constructorBasicCount = await ConstructorBasic.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return constructorBasicCount > 0;
  }
}

module.exports = new ConstructorBasicService();
