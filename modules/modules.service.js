const modelService = require('../model/model.service');

class ModulesService {
  constructor(ItemModule) {
    this.ItemModule = ItemModule;
  }

  async deleteItem(id, ERROR_MESSAGE) {
    const res = await this.ItemModule.findByIdAndDelete(id);
    return res || new Error(ERROR_MESSAGE);
  }

  async addItem(data, ERROR_MESSAGE) {
    if (await this.checkItemExist(data)) {
      throw new Error(ERROR_MESSAGE);
    }
    return new this.ItemModule(data).save();
  }

  async getAllItems() {
    return await this.ItemModule.find();
  }

  async updateItem(id, data, errors) {
    const item = await this.ItemModule.findById(id);
    if (!item) {
      throw new Error(errors[0]);
    }
    if (await this.checkItemExist(data, id)) {
      throw new Error(errors[1]);
    }
    const model = await modelService.getModelById(data.model);
    data.model = model.name;
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async checkItemExist(data, id) {
    const itemsCount = await this.ItemModule.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return itemsCount > 0;
  }
}

module.exports = new ModulesService();
