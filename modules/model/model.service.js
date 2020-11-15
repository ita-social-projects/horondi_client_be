const { ObjectId } = require('mongoose').Types;
const Model = require('./model.model');
const {
  CATEGORY_NOT_VALID,
  MODEL_ALREADY_EXIST,
  MODEL_NOT_FOUND,
  MODEL_NOT_VALID,
} = require('../../error-messages/model.messages');
const { deleteFiles, uploadFiles } = require('../upload/upload.service');

class ModelsService {
  async getAllModels({ skip, limit }) {
    const items = await Model.find()
      .populate('categories')
      .skip(skip)
      .limit(limit);

    const count = await Model.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getModelById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(MODEL_NOT_VALID);
    }
    const foundModel = await Model.findById(id);
    if (foundModel) {
      return foundModel;
    }
    throw new Error(MODEL_NOT_FOUND);
  }

  async getModelsByCategory(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(CATEGORY_NOT_VALID);
    }
    return Model.find({ category: id });
  }

  async addModel(data, upload) {
    if (await this.checkModelExist(data)) {
      throw new Error(MODEL_ALREADY_EXIST);
    }

    if (upload) {
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      data.images = imageResults.fileNames;
    }

    return await new Model(data).save();
  }

  async updateModel(id, newModel, upload) {
    const model = await Model.findById(id);
    if (!model) {
      throw new Error(MODEL_NOT_FOUND);
    }

    if (upload) {
      if (model.images) {
        const images = Object.values(model.images).filter(
          item => typeof item === 'string' && item
        );
        await deleteFiles(images);
      }
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      newModel.images = imageResults.fileNames;
    }
    return Model.findByIdAndUpdate(id, newModel, { new: true });
  }

  async deleteModel(id) {
    const model = await Model.findByIdAndDelete(id);

    if (!model) {
      throw new Error(MODEL_NOT_FOUND);
    }

    const images = Object.values(model.images).filter(
      item => typeof item === 'string' && item
    );
    if (images.length) {
      deleteFiles(images);
    }

    return model;
  }

  async checkModelExist(data) {
    const modelCount = await Model.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return modelCount > 0;
  }
}
module.exports = new ModelsService();
