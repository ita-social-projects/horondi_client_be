const Model = require('./model.model');
const ObjectId = require('mongoose').Types.ObjectId;
const {
  CATEGORY_NOT_VALID,
  MODEL_ALREADY_EXIST
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

  deleteModel(id) {
    return Model.findByIdAndDelete(id);
  }

  async checkModelExist(data) {
    const productCount = await Model.countDocuments({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return productCount > 0;
  }
}
module.exports = new ModelsService();
