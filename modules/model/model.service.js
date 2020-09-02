const ObjectId = require('mongoose').Types.ObjectId;
const Model = require('./model.model');
const {
  CATEGORY_NOT_VALID,
  MODEL_ALREADY_EXIST,
  MODEL_NOT_FOUND
} = require('../../error-messages/model.messages');
const CategoryService = require('../category/category.service')

class ModelsService {
  async getModelsByCategory(id) {
    if(!ObjectId.isValid(id)){
      throw new Error(CATEGORY_NOT_VALID)
    }
    await CategoryService.getCategoryById(id)
    return Model.find({ category: id })
  }

  async addModel(data) {
    if (await this.checkModelExist(data)) {
      throw new Error(MODEL_ALREADY_EXIST);
    }
    return await new Model(data).save();
  }

  async updateModel(id, newModel) {
    const model = await Model.findById(id);
    if (!model) {
      throw new Error(MODEL_NOT_FOUND);
    }
    if (await this.checkModelExist(newModel)) {
      throw new Error(MODEL_ALREADY_EXIST);
    }
    return Model.findByIdAndUpdate(id, newModel, { new: true });
  }

  deleteModel(id) {
    return Model.findByIdAndDelete(id);
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

  async getModelName(data) {
    const model = await Model.findById(data.model)
    const productModel = {
      model: model.name
    }
    return {...data, ...productModel} 
  }
}
module.exports = new ModelsService();
