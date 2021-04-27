const { ObjectId } = require('mongoose').Types;
const Model = require('./model.model');
const ConstructorBasic = require('../constructor/constructor-basic/constructor-basic.model');
const ConstructorBottom = require('../constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocket = require('../constructor/constructor-front-pocket/constructor-front-pocket.model');
const {
  CATEGORY_NOT_VALID,
  MODEL_ALREADY_EXIST,
  MODEL_NOT_FOUND,
  MODEL_NOT_VALID,
} = require('../../error-messages/model.messages');
const uploadService = require('../upload/upload.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

class ModelsService {
  async getAllModels({ skip, limit }) {
    const items = await Model.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Model.find()
      .countDocuments()
      .exec();
    return {
      items,
      count,
    };
  }

  async getModelById(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }

    const foundModel = await Model.findById(id).exec();

    if (foundModel) {
      return foundModel;
    }
    throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
  }

  async getModelsForConstructor() {
    return Model.find({ availableForConstructor: true });
  }

  async getModelsByCategory(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(CATEGORY_NOT_VALID, BAD_REQUEST);
    }
    return Model.find({ category: id });
  }

  async addModel(data, upload) {
    if (await this.checkModelExist(data)) {
      throw new RuleError(MODEL_ALREADY_EXIST, BAD_REQUEST);
    }

    if (upload) {
      const uploadResult = await uploadService.uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      data.images = imageResults.fileNames;
    }

    return await new Model(data).save();
  }

  async updateModel(id, newModel, upload) {
    const model = await Model.findById(id).exec();
    if (!model) {
      throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
    }

    if (upload) {
      if (model.images) {
        const images = Object.values(model.images).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }
      const uploadResult = await uploadService.uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      newModel.images = imageResults.fileNames;
    }
    return Model.findByIdAndUpdate(id, newModel, { new: true });
  }

  async deleteModel(id) {
    const model = await Model.findByIdAndDelete(id).exec();
    if (!model) {
      throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
    }
    model.constructorBasic.forEach(async basic => {
      await ConstructorBasic.findByIdAndDelete(basic).exec();
    });
    model.constructorBottom.forEach(async bottom => {
      await ConstructorBottom.findByIdAndDelete(bottom).exec();
    });
    await model.constructorFrontPocket.forEach(async pocket => {
      await ConstructorFrontPocket.findByIdAndDelete(pocket).exec();
    });

    const images = Object.values(model.images).filter(
      item => typeof item === 'string' && item
    );
    if (images.length) {
      uploadService.deleteFiles(images);
    }

    return model;
  }

  async addModelConstructorBasic(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorBasic: [constructorElementID] } }
    );
  }

  async deleteModelConstructorBasic(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorBasic: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorPattern(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorPattern: [constructorElementID] } }
    );
  }

  async deleteModelConstructorPattern(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorPattern: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorFrontPocket(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorFrontPocket: [constructorElementID] } }
    );
  }

  async deleteModelConstructorFrontPocket(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorFrontPocket: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorBottom(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorBottom: [constructorElementID] } }
    );
  }

  async deleteModelConstructorBottom(id, constructorElementID) {
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorBottom: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async checkModelExist(data) {
    const modelCount = await Model.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    }).exec();
    return modelCount > 0;
  }
}

module.exports = new ModelsService();
