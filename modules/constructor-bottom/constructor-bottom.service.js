const ConstructorBottom = require('./constructor-bottom.model');
const Currency = require('../currency/currency.model');
const Material = require('../material/material.service');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  IMAGE_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST,
} = require('../../error-messages/constructor-bottom.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');

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

  async addConstructorBottom(data, upload) {
    if (await this.checkConstructorBottomExist(data)) {
      throw new Error(CONSTRUCTOR_BOTTOM_ALREADY_EXIST);
    }
    if (!upload) {
      throw new Error(IMAGE_NOT_FOUND);
    }
    // const uploadResult = await uploadFiles([upload]);
    // const imageResults = await uploadResult[0];
    // data.image = imageResults.fileNames;
    data.image = {
      large: '',
      medium: '',
      small: '',
      thumbnail: '',
    };
    data.basePrice = await this.calculatePrice(data.basePrice);
    data.material = await Material.getMaterialById(data.material);
    return await new ConstructorBottom(data).save();
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

  async updateConstructorBottom(id, newConstructorBottom, upload) {
    const constructorBottom = await ConstructorBottom.findById(id).populate(
      'material'
    );
    if (!constructorBottom) {
      throw new Error(CONSTRUCTOR_BOTTOM_NOT_FOUND);
    }

    if (upload) {
      if (constructorBottom.image) {
        await deleteFiles([constructorBottom.image]);
      }
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      newConstructorBottom.image = imageResults.fileNames;
    }
    newConstructorBottom.basePrice = await this.calculatePrice(
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

    if (constructorBottom.image) {
      deleteFiles([constructorBottom.image]);
    }

    return constructorBottom;
  }

  async checkConstructorBottomExist(data, id) {
    if (id) {
      const constructorBottomCount = await ConstructorBottom.countDocuments({
        _id: { $ne: id },
        name: {
          $elemMatch: {
            $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
          },
        },
      });
      return constructorBottomCount > 0;
    }
    const constructorBottomCount = await ConstructorBottom.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return constructorBottomCount > 0;
  }
}

module.exports = new ConstructorBottomService();
