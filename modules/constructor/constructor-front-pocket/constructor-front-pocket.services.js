const { ObjectId } = require('mongoose').Types;
const ConstructorFrontPocket = require('./constructor-front-pocket.model');
const Currency = require('../../currency/currency.model');
const { deleteFiles, uploadFiles } = require('../../upload/upload.service');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
  IMAGE_NOT_PROVIDED,
} = require('../../../error-messages/constructor-front-pocket-messages');

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

  async calculatePrice(price) {
    const { convertOptions } = await Currency.findOne();
    return [
      {
        value: Math.round(price * convertOptions[0].exchangeRate * 100),
        currency: 'UAH',
      },
      {
        value: Math.round(price * 100),
        currency: 'USD',
      },
    ];
  }

  async addConstructorFrontPocket(data, upload) {
    if (await this.checkConstructorFrontPocketExist(data)) {
      throw new Error(FRONT_POCKET_ALREADY_EXIST);
    }
    if (!upload) {
      throw new Error(IMAGE_NOT_PROVIDED);
    }
    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    data.images = imageResults.fileNames;
    data.basePrice = await this.calculatePrice(data.basePrice);
    return await new ConstructorFrontPocket(data).save()
  }


  async updateConstructorFrontPocket({ id, pocket, upload }) {
    const basicToUpdate = await ConstructorFrontPocket.findById(id).populate(
      'material',
    );
    console.log(basicToUpdate)
    console.log(pocket)
    if (!basicToUpdate) {
      throw new Error(FRONT_POCKET_NOT_FOUND);
    }
    pocket.basePrice = await this.calculatePrice(pocket.basePrice);
    if (!upload) {
      return await ConstructorFrontPocket.findByIdAndUpdate(id, pocket,
        { new: true },
      );
    }
    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    const images = imageResults.fileNames;
    if (!images) {
      return await ConstructorFrontPocket.findByIdAndUpdate(id, pocket,
        { new: true },
      );
    }
    const foundBasic = await ConstructorFrontPocket.findById(id).lean();
    deleteFiles(Object.values(foundBasic.images));
    pocket.images = images
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
    const deletedImages = await deleteFiles(Object.values(foundConstructorFrontPocket.images));
    if (await Promise.allSettled(deletedImages)) {
      return foundConstructorFrontPocket;
    }
  }

  async checkConstructorFrontPocketExist(data, id) {
    if (id) {
      const constructorFrontPocketCount = await ConstructorFrontPocket.countDocuments({
        _id: { $ne: id },
        name: {
          $elemMatch: {
            $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
          },
        },
      });
      return constructorFrontPocketCount > 0;
    }
    const constructorFrontPocketCount = await ConstructorFrontPocket.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return constructorFrontPocketCount > 0;
  }
}

module.exports = new ConstructorFrontPocketService();
