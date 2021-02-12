const { uploadSmallImage } = require('../upload/upload.utils');
const { calculatePrice } = require('../currency/currency.utils');
const uploadService = require('../upload/upload.service');

class ConstructorService {
  async getAllConstructorElements({ skip, limit }, model) {
    const items = await model
      .find()
      .skip(skip)
      .limit(limit);

    const count = await model.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getConstructorElementById(id, model, error) {
    const foundElement = await model.findById(id);
    if (foundElement) {
      return foundElement;
    }
    throw new Error(error);
  }

  async addConstructorElement({ constructorElement, upload }, model, error) {
    if (upload) {
      constructorElement.image = await uploadSmallImage(upload);
    }
    if (await this.checkConstructorElementExist(constructorElement, model)) {
      throw new Error(error);
    }
    constructorElement.basePrice = await calculatePrice(
      constructorElement.basePrice
    );
    const basic = await new model(constructorElement).save();
    return await model.findById(basic._id);
  }

  async updateConstructorElement(
    { id, constructorElement, upload },
    model,
    error
  ) {
    const constructorFountElement = await model.findById(id);
    if (!constructorFountElement) {
      throw new Error(error);
    }

    if (upload) {
      await uploadService.deleteFile(constructorFountElement.image);
      constructorElement.image = await uploadSmallImage(upload);
    }
    constructorElement.basePrice = await calculatePrice(
      constructorElement.basePrice
    );
    return await model.findByIdAndUpdate(id, constructorElement, { new: true });
  }

  async deleteConstructorElement(id, model, error) {
    const constructorElement = await model.findByIdAndDelete(id);
    if (constructorElement) {
      if (constructorElement.image) {
        await uploadService.deleteFile(constructorElement.image);
      }
    }
    if (!constructorElement) {
      throw new Error(error);
    }
    return constructorElement;
  }

  async checkConstructorElementExist(data, model) {
    let constructorBasicCount = await model.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorBasicCount > 0;
  }
}

module.exports = new ConstructorService();
